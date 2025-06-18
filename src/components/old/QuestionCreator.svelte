<script>
  export let userId = '';
  export let createdBy = '';

  let questionText = '', choiceA = '', choiceB = '', choiceC = '', choiceD = '', correctAnswer = '';
  let message = '', isError = false;

  async function submitQuestion() {
    if (!questionText || !choiceA || !choiceB || !choiceC || !choiceD || !correctAnswer || !createdBy) {
      message = 'กรอกข้อมูลให้ครบ!';
      isError = true;
      return;
    }

    const body = {
      UserName: userId,
      questionText,
      choiceA,
      choiceB,
      choiceC,
      choiceD,
      correctAnswer,
      createdBy
    };

    try {
      const res = await fetch('https://masque-lab.adldigitalservice.com/services/csvspace/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        message = '✅ ส่งคำถามสำเร็จ!';
        isError = false;
        questionText = choiceA = choiceB = choiceC = choiceD = correctAnswer = '';
      } else {
        const data = await res.json();
        message = data.message || 'เกิดข้อผิดพลาด';
        isError = true;
      }
    } catch (e) {
      message = 'การเชื่อมต่อล้มเหลว';
      isError = true;
    }
  }
</script>

<div class="create-form container bg-red-500">
  <h2 class="form-title">➕ สร้างแบบคำถาม</h2>
  <form on:submit|preventDefault={submitQuestion} class="quiz-form">
    <div class="form-group">
      <label>ชื่อผู้สร้าง</label>
      <input class="form-input" bind:value={createdBy} disabled />
    </div>

    <div class="form-group">
      <label>คำถาม</label>
      <textarea class="form-textarea" rows="3" bind:value={questionText} placeholder="พิมพ์คำถามที่นี่"></textarea>
    </div>

    <div class="form-group">
      <label>ตัวเลือก A</label>
      <input class="form-input" bind:value={choiceA} />
    </div>

    <div class="form-group">
      <label>ตัวเลือก B</label>
      <input class="form-input" bind:value={choiceB} />
    </div>

    <div class="form-group">
      <label>ตัวเลือก C</label>
      <input class="form-input" bind:value={choiceC} />
    </div>

    <div class="form-group">
      <label>ตัวเลือก D</label>
      <input class="form-input" bind:value={choiceD} />
    </div>

    <div class="form-group">
      <label>คำตอบที่ถูกต้อง</label>
      <select class="form-select" bind:value={correctAnswer}>
        <option disabled value="">เลือกคำตอบที่ถูกต้อง</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
    </div>

    <div class="submit-area">
      <button type="submit" class="submit-btn">📤 ส่ง</button>
    </div>

    {#if message}
      <p class={isError ? 'error' : 'success'}>{message}</p>
    {/if}
  </form>
</div>
