<template>
  <div>
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
    <div v-if="currentPayment && currentPayment.instructions && currentPayment.instructions.length">
      <h4>Instructions:</h4>
      <div v-for="instruction in currentPayment.instructions" :key="instruction.id">
        <h5>{{instruction.name}}</h5>
        <div v-html="instruction.content"></div>
      </div>
    </div>
    <button class="button secondary" @click="back">Back</button>
    <button :class="{'button': true, 'primary': true, 'disabled': loading}" @click="process">Process</button>
  </div>
</template>

<script>
import axios from 'axios'
import { setHeaders, getVa, getVars } from '../lib'
export default {
  data () {
    return {
      loading: false
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
  mounted () {
    console.log('this.currentPayment', this.currentPayment)
    console.log('this.orderDetails', this.orderDetails)
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
              this.onClose()
            }
          }
          this.loading = false
        }
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
</style>