import requests

def postRequest(url: str, data: any, headers: dict) -> requests.Response:
    return requests.post(url, data = data, headers = headers)
