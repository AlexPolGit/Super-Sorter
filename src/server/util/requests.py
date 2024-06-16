import requests

def getRequest(url: str, headers: dict) -> requests.Response:
    try: 
        response = requests.get(url, headers = headers)
        response.raise_for_status()
        return response
    except requests.exceptions.HTTPError as errh: 
        raise errh
    except requests.exceptions.ReadTimeout as errrt: 
        raise errrt
    except requests.exceptions.ConnectionError as conerr: 
        raise conerr
    except requests.exceptions.RequestException as errex: 
        raise errex

def postRequest(url: str, data: any, headers: dict) -> requests.Response:
    try: 
        response = requests.post(url, data = data, headers = headers, timeout = 1, verify = True) 
        response.raise_for_status()
        return response
    except requests.exceptions.HTTPError as errh: 
        raise errh
    except requests.exceptions.ReadTimeout as errrt: 
        raise errrt
    except requests.exceptions.ConnectionError as conerr: 
        raise conerr
    except requests.exceptions.RequestException as errex: 
        raise errex
