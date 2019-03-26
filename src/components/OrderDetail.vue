<template>
  <div>
    <div v-if="!midtransUrl">
      <h1>Order Detail</h1>
      <table v-if="orderDetails">
        <tr>
          <th>Order Id</th>
          <td>{{orderDetails.order_id}}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>{{ getAmount().toLocaleString() }}</td>
        </tr>
      </table>
      <div v-if="currentPayment && currentPayment.slug === 'credit-card'">
        <form>
          <div class="grid-container">
            <div class="grid-x grid-padding-x">
              <div class="medium-6 cell">
                <label>
                  Card Number
                  <input
                    type="text"
                    v-model="cardNumber"
                    placeholder="4811 1111 1111 1114"
                  >
                </label>
              </div>
              <div class="medium-6 cell">
                <label>
                  Card CVV
                  <input type="text" v-model="cardCvv" size="4" placeholder="123">
                </label>
              </div>
              <div class="medium-6 cell">
                <label>
                  Month Expiry
                  <input type="text" v-model="expMonth" size="2" placeholder="01">
                </label>
              </div>
              <div class="medium-6 cell">
                <label>
                  Year Expiry
                  <input type="text" v-model="expYear" size="4" placeholder="2020">
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        v-if="currentPayment && currentPayment.slug !== 'credit-card' && currentPayment.instructions && currentPayment.instructions.length"
      >
        <h4>Instructions:</h4>
        <div v-for="instruction in currentPayment.instructions" :key="instruction.id">
          <h5>{{instruction.name}}</h5>
          <div v-html="instruction.content"></div>
        </div>
      </div>
      <button class="button secondary" @click="back">Back</button>
      <button
        v-if="currentPayment && currentPayment.slug !== 'credit-card'"
        :class="{'button': true, 'primary': true, 'disabled': loading}"
        @click="process"
      >Process</button>
      <button
        v-if="currentPayment && currentPayment.slug === 'credit-card'"
        :class="{'button': true, 'primary': true, 'disabled': loading}"
        @click="getToken"
      >Get Token</button>
    </div>
    <div v-if="midtransUrl">
      <iframe
        :src="midtransUrl"
        frameborder="0"
        width="100%"
        height="600px"
        crossorigin="anonymous"
        target="_parent"
        ref="cardFrame"
      ></iframe>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { setHeaders, getVa, getVars } from '../lib'
export default {
  data () {
    return {
      loading: false,
      cardNumber: '',
      cardCvv: '',
      expMonth: '',
      expYear: '',
      midtransUrl: null,
      tokenId: null
    }
  },
  computed: {
    currentPayment () {
      return this.$store.state.currentPayment
    },
    orderDetails () {
      return this.$store.state.orderDetails
    }
  },
  methods: {
    back () {
      this.$store.commit('setPaymentStep', 2)
    },
    getAmount () {
      let total = 0
      if (this.orderDetails) {
        this.orderDetails.item_details.map(
          item => (total += item.price * item.quantity)
        )
      }
      return total
    },
    async process () {
      try {
        if (this.orderDetails && this.currentPayment) {
          this.loading = true
          const headers = await setHeaders()
          this.orderDetails.midtrans_payment_id = this.currentPayment.id
          const resp = await axios
            .post(
              `${getVars.midtransPaymentUrl()}/midtrans-charge`,
              this.orderDetails,
            {
              headers
            }
            )
            .then(res => res.data)
          if (resp.meta.status === 200) {
            if (this.currentPayment.transaction_type === 'Bank Transfer') {
              this.currentResponse = resp.data
              this.$store.commit(
                'setVaNumber',
                getVa(this.currentPayment.bank, this.currentResponse)
              )
              this.$store.commit('setPaymentStep', 4)
            } else {
              alert(JSON.stringify(resp.data))
              this.clearStore()
            }
          }
          this.loading = false
        }
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },
    async getToken () {
      if (
        this.cardNumber === '' &&
        this.cardCvv === '' &&
        this.expMonth === '' &&
        this.expYear === ''
      ) {
        alert('Please fill the form')
        return
      }
      this.loading = true
      // eslint-disable-next-line
      Veritrans.url = getVars.midtransUrl() + "/v2/token";
      // eslint-disable-next-line
      Veritrans.client_key = getVars.midtransClientKey();
      const card = () => {
        return {
          card_number: this.cardNumber,
          card_cvv: this.cardCvv,
          card_exp_month: this.expMonth,
          card_exp_year: this.expYear,
          secure: true,
          gross_amount: this.getAmount()
        }
      }

      const callback = async response => {
        if (response.redirect_url) {
          this.midtransUrl = response.redirect_url
        } else if (response.status_code === '200') {
          this.midtransUrl = null
          // Submit form
          this.orderDetails.token_id = response.token_id
          await this.process()
        } else {
          this.midtransUrl = null
          // Failed request token
          alert(response.status_message)
          this.clearStore()
        }
      }
      // eslint-disable-next-line
      Veritrans.token(card, callback);
    },
    clearStore () {
      this.$store.commit('setPaymentStep', 1)
      this.$store.commit('setOrderDetails', null)
      this.$store.commit('setCurrentPayment', null)
      this.$store.commit('setVaNumber', '')
    }
  }
}
</script>

<style scoped>
</style>