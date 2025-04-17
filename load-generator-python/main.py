import logging
import signal
import sys
import time
from threading import Event
from dotenv import load_dotenv
from config import get_config
from api import send_request

# Load environment variables from .env file
load_dotenv()

terminate_event = Event()

def run_load_generator(api_urls: list[str], delay_ms: float):
    while not terminate_event.is_set():
        for url in api_urls:
            if terminate_event.is_set():
                break
            try:
                send_request(url)
            except Exception as e:
                logging.error(f"[{url}] → ERROR: {e}")
            time.sleep(delay_ms / 1000.0)
    logging.info("✅ Load generator terminated gracefully.")

def signal_handler(signum, frame):
    logging.info(f"🛑 Received signal {signum}, terminating...")
    terminate_event.set()

if __name__ == "__main__":
    config = get_config()
    logging.basicConfig(level=getattr(logging, config["LOG_LEVEL"].upper(), logging.INFO),
                        format='%(asctime)s - %(levelname)s - %(message)s')
    try:
        delay_ms = config["DELAY_MS"]
        base_url = config["BASE_URL"]
        targets = config["TARGETS"]

        target_services = {
            "golang": f"{base_url}/api/golang/",
            "node": f"{base_url}/api/node/"
        }
        api_urls = list({target_services[t] for t in targets.split(",") if t in target_services})
        if not api_urls:
            logging.error("❌ No valid targets specified. Set TARGETS to 'golang', 'node' or both.")
            sys.exit(1)

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

        logging.info(f"🚀 Starting load generator for: {', '.join(api_urls)}")
        logging.info(f"📡 Delay between requests: {delay_ms} ms")

        run_load_generator(api_urls, delay_ms)

    except Exception as e:
        logging.exception("❌ Unhandled exception occurred:")
        sys.exit(1)
    finally:
        logging.info("👋 Exiting.")
