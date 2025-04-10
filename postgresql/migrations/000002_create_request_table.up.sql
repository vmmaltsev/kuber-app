-- Create the request table for tracking API requests
CREATE TABLE IF NOT EXISTS public.request (
    id SERIAL PRIMARY KEY,
    api_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster lookups by API name
CREATE INDEX IF NOT EXISTS idx_request_api_name ON public.request(api_name);