class GetVars {
  midtransPaymentUrl () {
    if (process.env === 'production') {
      return 'https://midtrans.toorhop.com/api/v1'
    }
    return 'https://midtrans.toorhop.com/api/dev-v1'
  }

  toorhopClientKey () {
    return 'LFgQNUYugaRy'
  }

  toorhoopClientSecret () {
    return '63124939efecaefa67b2e22cd09881b49e748f2b'
  }

  midtransUrl () {
    if (process.env === 'production') {
      return 'https://api.midtrans.com'
    }
    return 'https://api.sandbox.midtrans.com'
  }

  midtransClientKey () {
    if (process.env === 'production') {
      return 'Mid-client-Rz847L0MsosHAZfr'
    }
    return 'SB-Mid-client-shfS_hwQZIIDkJUn'
  }
}

export default new GetVars()
