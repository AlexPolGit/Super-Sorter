import requests

def getRequest(url: str, headers: dict) -> requests.Response:
    return requests.get(url, headers = headers)

def postRequest(url: str, data: any, headers: dict) -> requests.Response:
    return requests.post(url, data = data, headers = headers)
