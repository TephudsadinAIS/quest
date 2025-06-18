<script>
  export let show = false;
  export let rankingData = [];
  export let loggedInUser = '';
  export let onClose = () => {};
</script>

{#if show}
<div class="ranking-popup">
  <div class="ranking-header">
    <h2>🏆 ตารางคะแนน</h2>
    <button class="close-btn" on:click={onClose}>×</button>
  </div>

  <div class="ranking-body">
    <table class="ranking-table">
      <thead>
        <tr>
          <th>ลำดับ</th>
          <th>ผู้ใช้</th>
          <th>คะแนน</th>
          <th>จำนวนครั้ง</th> <!-- ✅ เพิ่ม -->
        </tr>
      </thead>
      <tbody>
        {#each rankingData.sort((a, b) => b.score - a.score) as entry, i}
          <tr class={entry.userId === loggedInUser ? 'highlight green' : ''}>
            <td>{i + 1}</td>
            <td>{entry.userId}</td>
            <td>{entry.score}</td>
            <td>{entry.count}</td> <!-- ✅ เพิ่ม -->
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
{/if}
