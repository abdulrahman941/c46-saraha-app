export const confirmEmailKey=(id)=>`usermodels:${id}:otp.confirmation`

export const revokeTokenKey=(id,jti)=>`usermodels:${id}:login:${jti}`

export const forgetPasswordKey=(id)=>`usermodels:${id}:otp:forgetpassword`