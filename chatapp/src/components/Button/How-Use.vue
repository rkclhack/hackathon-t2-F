<template>
  <div class="how-use-container">
    <button 
      @click="toggleModal" 
      class="how-use-button"
      :class="{ 'button-active': isModalOpen }"
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <path d="M12 17h.01"></path>
      </svg>
      使い方
    </button>
    
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">
              <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              Vue.js FB特化チャットアプリの使い方
            </h2>
            <button @click="closeModal" class="close-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="instruction-section">
              <h3 class="section-title">
                <span class="step-number">1</span>
                基本的なチャット機能
              </h3>
              <ul class="instruction-list">
                <li><strong>メッセージ投稿：</strong>テキストエリアにメッセージを入力し「投稿」ボタンをクリック</li>
                <li><strong>個人メモ：</strong>「メモ」ボタンで自分専用のメモを作成できます</li>
                <!-- <li><strong>リアルタイム通信：</strong>他のユーザーとリアルタイムでチャットが可能</li> -->
                <li><strong>退室機能：</strong>「退室する」ボタンでチャットルームから退出</li>
              </ul>
            </div>
            
            <div class="instruction-section">
              <h3 class="section-title">
                <span class="step-number">2</span>
                フィードバック機能
              </h3>
              <ul class="instruction-list">
                <li><strong>🟦 FB：</strong>各チャットメッセージに表示される</li>
                <li class="sub-feature">
                  <strong>機能詳細：</strong>
                  <ul>
                    <li>フィードバックタイプ選択（👍Good、👎Bad）</li>
                    <!-- <li>500文字までの詳細フィードバック入力</li> -->
                    <!-- <li>5段階の星評価機能</li> -->
                  </ul>
                </li>
                <li><strong>🟧 FB閲覧：</strong>各チャットメッセージに表示される</li>
                <li class="sub-feature">
                  <strong>機能詳細：</strong>
                  <ul>
                    <li>フィードバック一覧表示</li>
                    <!-- <li>統計情報表示（総数、平均評価、ポジティブ率）</li> -->
                    <!-- <li>フィードバックへのいいね機能と返信機能</li> -->
                  </ul>
                </li>
              </ul>
            </div>
            
            <div class="instruction-section">
              <h3 class="section-title">
                <span class="step-number">3</span>
                ユーザーアイコンとUI
              </h3>
              <ul class="instruction-list">
                <li><strong>アバター表示：</strong>各メッセージにユーザー名の頭文字がカラフルなアイコンで表示</li>
                <!-- <li><strong>オンライン状態：</strong>アイコン右下の小さな丸で状態表示</li> -->
                <!-- <li class="sub-feature"> -->
                  <!-- <strong>状態の種類：</strong> -->
                  <!-- <ul> -->
                    <!-- <li>🟢 緑色：オンライン（脈打つアニメーション）</li> -->
                    <!-- <li>⚫ グレー：オフライン</li> -->
                    <!-- <li>🟠 オレンジ：離席中</li> -->
                  <!-- </ul> -->
                <!-- </li> -->
                <!-- <li><strong>メッセージの色分け：</strong>自分のメッセージは青系、他の人は赤系のグラデーション</li> -->
                <li><strong>投稿時間：</strong>各メッセージに自動的に時刻が表示されます</li>
              </ul>
            </div>
            
            <!-- <div class="instruction-section"> -->
              <!-- <h3 class="section-title"> -->
                <!-- <span class="step-number">4</span> -->
                <!-- 画面レイアウト -->
              <!-- </h3> -->
              <!-- <ul class="instruction-list"> -->
                <!-- <li><strong>ヘッダー：</strong>「Vue.js FB特化 チャットルーム」タイトルと右上の「使い方」ボタン</li> -->
                <!-- <li><strong>ユーザー情報：</strong>現在ログイン中のユーザー名が上部に表示</li> -->
                <!-- <li><strong>入力エリア：</strong>モダンなデザインのテキストエリアと投稿・メモボタン</li> -->
                <!-- <li><strong>チャット履歴：</strong>「💬 チャット履歴」セクションに全てのメッセージが表示</li> -->
                <!-- <li><strong>スクロール機能：</strong>メッセージが多い場合は自動でスクロール可能</li> -->
              <!-- </ul> -->
            <!-- </div> -->
            
            <div class="tips-section">
              <h3 class="tips-title">💡 使い方のコツ</h3>
              <div class="tips-grid">
                <div class="tip-card">
                  <div class="tip-icon">⚡</div>
                  <div class="tip-title">効率的な使用</div>
                  <p>フィードバック機能を活用してコミュニケーションの質を向上させましょう</p>
                </div>
                <div class="tip-card">
                  <div class="tip-icon">🎨</div>
                  <div class="tip-title">モダンUI</div>
                  <p>グラデーションとアニメーションでスムーズな操作体験を提供</p>
                </div>
                <!-- <div class="tip-card">
                  <div class="tip-icon">📱</div>
                  <div class="tip-title">レスポンシブ</div>
                  <p>デスクトップ・タブレット・スマートフォンに完全対応</p>
                </div> -->
                <!-- <div class="tip-card">
                  <div class="tip-icon">📊</div>
                  <div class="tip-title">分析機能</div>
                  <p>フィードバックの統計情報で会話の傾向を把握できます</p>
                </div> -->
                <div class="tip-card">
                  <div class="tip-icon">🔄</div>
                  <div class="tip-title">リアルタイム</div>
                  <p>Socket.ioによる瞬時のメッセージ配信と更新</p>
                </div>
                <!-- <div class="tip-card">
                  <div class="tip-icon">🎯</div>
                  <div class="tip-title">フィルタリング</div>
                  <p>フィードバックタイプ別の表示で必要な情報を素早く確認</p>
                </div> -->
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="closeModal" class="got-it-button">
              理解しました！チャットを始めよう
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isModalOpen = ref(false)

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<style scoped>
.how-use-container {
  position: relative;
}

.how-use-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.how-use-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.how-use-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #7c8fea 0%, #8b5cf6 100%);
}

.how-use-button:hover::before {
  left: 100%;
}

.button-active {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.icon {
  width: 18px;
  height: 18px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.title-icon {
  width: 28px;
  height: 28px;
  color: #667eea;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.2s;
  color: #6b7280;
}

.close-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-button svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 24px 32px;
}

.instruction-section {
  margin-bottom: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.instruction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.instruction-list li {
  padding: 12px 0;
  border-left: 3px solid #e5e7eb;
  padding-left: 20px;
  margin-bottom: 8px;
  position: relative;
  color: #4b5563;
  line-height: 1.6;
}

.instruction-list li::before {
  content: '→';
  position: absolute;
  left: -8px;
  color: #667eea;
  font-weight: bold;
}

.sub-feature {
  margin-left: 20px;
  border-left-color: #cbd5e1;
}

.sub-feature ul {
  list-style: none;
  padding: 8px 0 0 0;
  margin: 8px 0 0 0;
}

.sub-feature ul li {
  padding: 6px 0;
  border-left: 2px solid #f1f5f9;
  padding-left: 16px;
  margin-bottom: 4px;
  font-size: 14px;
  color: #64748b;
}

.sub-feature ul li::before {
  content: '•';
  left: -6px;
  color: #94a3b8;
}

.tips-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  padding: 24px;
  margin-top: 32px;
  border: 1px solid #e2e8f0;
}

.tips-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.tip-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  border: 1px solid #f1f5f9;
}

.tip-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.tip-icon {
  font-size: 28px;
  margin-bottom: 12px;
  display: block;
}

.tip-title {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 8px;
}

.tip-card p {
  color: #4b5563;
  font-size: 13px;
  margin: 0;
  line-height: 1.5;
}

.modal-footer {
  padding: 16px 32px 32px;
  text-align: center;
}

.got-it-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 16px 36px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.got-it-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: scale(0.95) translateY(-20px);
}

.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-20px);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 15px;
    max-height: 95vh;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .modal-title {
    font-size: 18px;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .how-use-button {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .instruction-list li {
    font-size: 14px;
  }
  
  .sub-feature {
    margin-left: 10px;
  }
}
</style>