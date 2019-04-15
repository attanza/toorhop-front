const getMidtransKeys = () => {
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'production') {
    return {
      isProduction: true,
      serverKey: 'Mid-server-shH9Mc2q0lsVQ-WMohrbp_Jt',
      clientKey: 'Mid-client-Rz847L0MsosHAZfr'
    }
  } else {
    return {
      isProduction: false,
      serverKey: 'SB-Mid-server-VmA4gOTZQNEKwnbaL04Xjtsj',
      clientKey: 'SB-Mid-client-shfS_hwQZIIDkJUn'
    }
  }
}

export default getMidtransKeys
