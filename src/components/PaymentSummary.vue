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
      <tr>
        <th>Va Number</th>
        <td>{{vaNumber}}</td>
      </tr>
      <tr>
        <th>Note</th>
        <td>
          Please do payment before
          <strong>{{getExpiry()}}</strong>
        </td>
      </tr>
    </table>
    <div v-if="currentPayment && currentPayment.instructions && currentPayment.instructions.length">
      <h4>Instructions:</h4>
      <div v-for="instruction in currentPayment.instructions" :key="instruction.id">
        <h5>{{instruction.name}}</h5>
        <div v-html="instruction.content"></div>
      </div>
    </div>
    <button class="button secondary" @click="back">Close</button>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  computed: {
    currentPayment () {
      return this.$store.state.currentPayment
    },
    orderDetails () {
      return this.$store.state.orderDetails
    },
    vaNumber () {
      return this.$store.state.vaNumber
    }
  },
  methods: {
    back () {
      this.clearStore()
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
    getExpiry () {
      // Set expiry in accordance with you midtrans setting in midtrans dashboard
      // This expiry setting is just for user info, not the real expiry
      // Expiry setting can be set at midtrans dashboard
      const now = moment()
      now.add(1, 'days')
      return now.format('D MMMM YYYY hh:mm A')
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