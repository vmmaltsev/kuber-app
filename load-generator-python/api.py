import requests
import logging
import time

def send_request(url: str) -> float:
    start = time.time()
    response = requests.get(url, timeout=5)
    duration_ms = round((time.time() - start) * 1000, 2)
    logging.info(f"[{url}] → {response.status_code} ({duration_ms} ms)")
    return duration_ms 