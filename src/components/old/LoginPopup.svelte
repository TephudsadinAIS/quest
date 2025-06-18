<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let show = false;
  let userId = "";
  let errorMessage = "";
  const dispatch = createEventDispatcher();

  onMount(() => {
    if (!window.localStorage.getItem("userId")) {
      show = true;
    } else {
      userId = window.localStorage.getItem("userId");
       handleLogin() ;
    }
  });


  async function handleLogin() {
    errorMessage = "";
    if (!userId.trim()) {
      errorMessage = "กรุณากรอกชื่อผู้ใช้";
      return;
    }

    try {
      const res = await fetch(
        "https://masque-lab.adldigitalservice.com/services/csvspace/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        },
      );

      if (!res.ok) {
        errorMessage = "ไม่สามารถเข้าสู่ระบบได้";
        return;
      }

      dispatch("loginSuccess", { username: userId });
      window.localStorage.setItem("userId", userId);
    } catch (e) {
      errorMessage = "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์";
    }
  }

  function closePopup() {
    show = false;
    errorMessage = "";
    userId = "";
  }
</script>

{#if show}
  <div class="overlay">
    <div class="popup">
      <h2>เข้าสู่ระบบ</h2>
      <form on:submit|preventDefault={handleLogin}>
        <input type="text" bind:value={userId} placeholder="ชื่อผู้ใช้" />
        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}
        <button type="submit" class="login-btn">เข้าสู่ระบบ</button>
      </form>
    </div>
  </div>
{/if}
