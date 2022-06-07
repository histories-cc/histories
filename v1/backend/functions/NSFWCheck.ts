import axios from 'axios';

const NSFWCheck = async (url: string): Promise<number | undefined> => {
  // if API key is not defined just resolve as not NSFW
  // API documentation: https://rapidapi.com/inferdo/api/nsfw-image-classification1/
  if (process.env.RAPIDAPI_NSFW_KEY === undefined) {
    console.error('RAPIDAPI_NSFW_KEY not defiend');
    return 0;
  }

  // return API response
  const res = await axios
    .request({
      method: 'POST',
      url: 'https://nsfw-image-classification1.p.rapidapi.com/img/nsfw',
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'nsfw-image-classification1.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_NSFW_KEY,
      },
      data: { url },
    })
    .then(function (response) {
      return response.data.NSFW_Prob;
    })
    .catch(function (error) {
      console.error(error);
    });

  return res;
};

export default NSFWCheck;
