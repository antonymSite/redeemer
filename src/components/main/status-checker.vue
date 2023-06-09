<template>
  <div
    v-if="validRoute"
    v-bind="$attrs"
    class="status-checker"
  >
    <div class="<md:border-y md:border border-black bg-white">
      <div
        class="status-checker flex items-center text-xs sm:text-sm md:text-md lg:text-lg 2xl:text-xl font-bold px-6 cursor-pointer"
        @click="open = !open"
      >
        Verify Token Status
        <i
          class="text-lg mdi mdi-menu-down ml-auto"
          :class="{
            'mdi-menu-down': !open,
            'mdi-menu-up': open
          }"
        />
      </div>
      <div
        v-if="open"
        class="px-6 py-5"
      >
        <h1 class="md:text-lg lg:text-xl 2xl:text-2xl">
          Redemption Status
        </h1>
        <p class="text-xs md:text-sm 2xl:text-base mt-2">
          Enter an Antonym token ID to<br>
          confirm redemption status in real-time.
        </p>
        <div class="flex items-center mt-8">
          <div
            v-if="form.status !== null"
            class="flex items-center flex-grow bg-lightgrey h-10 text-xs px-4 cursor-pointer"
            @click="clear"
          >
            <i
              v-if="form.status"
              class="text-base mdi mdi-close-circle mr-1"
            />
            <i
              v-else
              class="text-base mdi mdi-check-circle mr-1"
            />
            <span v-if="form.status">
              STATUS: REDEEMED
            </span>
            <span v-else>
              STATUS: UNREDEEMED
            </span>
          </div>
          <input
            v-else
            v-model="form.tokenID"
            class="flex-grow bg-lightgrey h-10 text-xs px-4 placeholder-black/50 outline-none"
            placeholder="Enter Token ID (Ex. 1435)"
            type="text"
          >
          <button
            class="toggle-button toggle-button--active rounded-none px-8 py-3"
            @click="check"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const open = ref(false)
const validRoute = computed(() => route.name === 'Home' || route.name === 'Catalogue')

const form = reactive({
  tokenID: '',
  status: null as boolean | null
})

const check = async () => {
  const response = await request()
  if (response === true) {
    form.status = true
  } else {
    form.status = false
  }
}

const request = async () => {
  const res = await fetch('/.netlify/functions/token-status', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: JSON.stringify({
      tokenID: form.tokenID
    })
  })

  const { redeemed } = await res.json()
  return redeemed
}

const clear = () => {
  form.status = null
  form.tokenID = ''
}
</script>
