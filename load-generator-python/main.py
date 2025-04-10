import os
import time
import requests
import signal
import sys
import logging
from dotenv import load_dotenv
from threading import Event

# Load environment variables from .env file
load_dotenv()

# Graceful shutdown event
terminate_event = Event()

def run_load_generator(api_urls, delay_ms):
    while not terminate_event.is_set():
        for url in api_urls:
            if terminate_event.is_set():
                break
            try:
                start = time.time()
                response = requests.get(url, timeout=5)
                duration_ms = round((time.time() - start) * 1000, 2)
                logging.info(f"[{url}] → {response.status_code} ({duration_ms} ms)")
            except requests.RequestException as e:
                logging.error(f"[{url}] → ERROR: {e}")
            time.sleep(delay_ms / 1000.0)
    logging.info("✅ Load generator terminated gracefully.")

def signal_handler(signum, frame):
    logging.info(f"🛑 Received signal {signum}, terminating...")
    terminate_event.set()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    try:
        delay_ms = float(os.getenv("DELAY_MS", "1000"))
        base_url = os.getenv("BASE_URL", "http://localhost:8080")
        targets = os.getenv("TARGETS", "golang,node").lower()

        # Возможные целевые сервисы
        target_services = {
            "golang": f"{base_url}/api/golang/",
            "node": f"{base_url}/api/node/"
        }

        # Формирование списка уникальных URL
        api_urls = list({target_services[t] for t in targets.split(",") if t in target_services})

        if not api_urls:
            logging.error("❌ No valid targets specified. Set TARGETS to 'golang', 'node' or both.")
            sys.exit(1)

        # Обработка сигналов завершения
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
