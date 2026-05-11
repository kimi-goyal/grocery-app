
export const loginUser = async () => {
  localStorage.setItem('token', 'dummy-token')
}

export const logoutUser = () => {
  localStorage.removeItem('token')
}
