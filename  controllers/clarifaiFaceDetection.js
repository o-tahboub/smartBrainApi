import fetch from 'node-fetch'

export const clarifaiFaceDetectionHandler = async (req, res, clarifaiConfig) => {
    const { imageUrl } = req.body

    try {
        const response = await fetch(
            'https://api.clarifai.com/v2/models/face-detection/outputs', 
            getClarifaiRequestOptions(clarifaiConfig, imageUrl))
            const data = await response.json()
            return res.json(data)
    } catch(err) {
        return res.status(500).json('Server error: could not get clarifai input')
    }
}

const setupClarifaiRequestBody = (config, imageUrl) => {
    return JSON.stringify({
      "user_app_id": {
          "user_id": config.USER_ID,
          "app_id": config.APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": imageUrl
                  }
              }
          }
      ]
  })
  }

const getClarifaiRequestOptions = (config, imageUrl) => {
  return {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + config.PAT
      },
    body: setupClarifaiRequestBody(config, imageUrl)
  }
}
