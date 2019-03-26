<template>
  <div>
    <h1>Select Payment</h1>
    <div v-if="payments && payments.length">
      <article class="media" v-for="payment in payments" :key="payment.id">
        <figure class="media-left">
          <p class="image is-64x64">
            <img :src="getLogo(payment.logo)">
          </p>
        </figure>
        <div class="media-content">
          <a class="content" @click="setCurrentPayment(payment)">
            <p>
              <strong>{{payment.name}}</strong>
              <br>
              {{payment.description}}
            </p>
          </a>
        </div>
      </article>
    </div>

    <button class="button secondary" @click="back">Back</button>
  </div>
</template>

<script>
import axios from 'axios'
import { setHeaders, getVars } from '../lib'
export default {
  data () {
    return {
      payments: []
    }
  },
  mounted () {
    this.getPayments()
  },
  methods: {
    back () {
      this.$store.commit('setPaymentStep', 1)
    },
    async getPayments () {
      try {
        const headers = await setHeaders()
        const resp = await axios
          .get(`${getVars.midtransPaymentUrl()}/midtrans-payment-list`, {
            headers
          })
          .then(res => res.data)
        if (resp.meta.status === 200) {
          this.payments = resp.data
        }
      } catch (e) {
        console.log('e', e)
        this.cancel()
      }
    },
    getLogo (logo) {
      if (logo && logo !== '') return logo
      else return '/static/images/brokenimage.png'
    },
    setCurrentPayment (p) {
      this.$store.commit('setCurrentPayment', p)
      this.$store.commit('setPaymentStep', 3)
    }
  }
}
</script>

<style scoped>
.media {
  align-items: flex-start;
  display: flex;
  text-align: left;
}

.media .content:not(:last-child) {
  margin-bottom: 0.75rem;
}

.media-left {
  margin-right: 1rem;
}

.media-content {
  flex-basis: auto;
  flex-grow: 1;
  flex-shrink: 1;
  text-align: left;
}

.image {
  display: block;
  position: relative;
}

.image img {
  display: block;
  height: auto;
  width: 100%;
}

.image.is-64x64 {
  height: 64px;
  width: 64px;
}

a {
  line-height: inherit;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}
</style>
