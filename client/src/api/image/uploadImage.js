export const addProfileImage = async (fd) => {
  const response = await fetch('http://localhost:8000/image/addProfileImage', {
    method : 'POST',
    mode : 'cors',
    headers : {
      'jwt' : localStorage.jwt
    },
    body : fd
  });

  return response;
}

export const addSecondaryImage = async (numeroImage, fd) => {
    const response = await fetch('http://localhost:8000/image/addSecondaryImage/' + numeroImage, {
      method : 'POST',
      mode : 'cors',
      headers : {
        'jwt' : localStorage.jwt
      },
      body : fd
    });

    return response;
};
