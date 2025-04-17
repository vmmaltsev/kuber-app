import os

def get_config():
    return {
        "BASE_URL": os.getenv("BASE_URL", "http://localhost:8080"),
        "TARGETS": os.getenv("TARGETS", "golang,node").lower(),
        "DELAY_MS": float(os.getenv("DELAY_MS", "1000")),
        "LOG_LEVEL": os.getenv("LOG_LEVEL", "INFO"),
    } 