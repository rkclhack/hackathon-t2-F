<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  chatData: {
    type: Object,
    required: true
  }
})

const fbMessage = computed(() => {
  return {
    userName: props.chatData.userName,
    message: props.chatData.message,
    timestamp: props.chatData.timestamp || new Date(),
    reactions: props.chatData.reactions || [],
    isLiked: props.chatData.isLiked || false,
    comments: props.chatData.comments || []
  }
})

const toggleLike = () => {
  console.log('DDmL�U�~W_')
}

const addComment = ref('')
const showCommentBox = ref(false)

const router = useRouter()

const onFeedback = () => {
  router.push({ name: 'send' })
}

const onViewFeedback = () => {
  router.push({ name: 'receive', params: { id: 1 } })
}

const submitComment = () => {
  if (addComment.value.trim()) {
    console.log('���ȕ?:', addComment.value)
    addComment.value = ''
    showCommentBox.value = false
  }
}
</script>

<template>
  <div class="fb-message-container">
    <!-- �����1h�û�� -->
    <div class="fb-message-header">
      <div class="user-avatar">
        {{ fbMessage.userName.charAt(0) }}
      </div>
      <div class="user-info">
        <div class="user-name">{{ fbMessage.userName }}</div>
        <div class="message-time">{{ new Date(fbMessage.timestamp).toLocaleString() }}</div>
      </div>
    </div>
    
    <!-- �û��,� -->
    <div class="fb-message-content">
      {{ fbMessage.message }}
    </div>
    
    <!-- ꢯ���� -->
    <div class="fb-reactions">
      <div class="reaction-stats" v-if="fbMessage.reactions.length > 0">
        =M {{ fbMessage.reactions.length }}�LDDmW~W_
      </div>
      
      <!-- �����ܿ� -->
      <div class="fb-actions">
        <button 
          class="fb-action-btn like-btn" 
          :class="{ active: fbMessage.isLiked }"
          @click="toggleLike"
        >
          =M DDm
        </button>
        <button 
          class="fb-action-btn comment-btn"
          @click="showCommentBox = !showCommentBox"
        >
          =� ����
        </button>
        <button class="fb-action-btn share-btn">
          = ���
        </button>
      </div>
    </div>
    
    <!-- ����e� -->
    <div class="fb-comment-section" v-if="showCommentBox">
      <div class="comment-input-area">
        <input 
          v-model="addComment" 
          type="text" 
          placeholder="���Ȓe�..."
          class="comment-input"
          @keydown.enter="submitComment"
        >
        <button @click="submitComment" class="comment-submit-btn">�?</button>
      </div>
    </div>
    
    <!-- 個別FBボタン -->
    <div class="fb-individual-actions">
      <button @click="onFeedback" class="fb-individual-btn fb-btn">FBする</button>
      <button @click="onViewFeedback" class="fb-individual-btn fb-view-btn">FB見る</button>
    </div>
    
    <!-- �Xn����h: -->
    <div class="fb-comments" v-if="fbMessage.comments.length > 0">
      <div 
        v-for="(comment, index) in fbMessage.comments" 
        :key="index"
        class="fb-comment"
      >
        <div class="comment-avatar">{{ comment.userName.charAt(0) }}</div>
        <div class="comment-content">
          <div class="comment-user">{{ comment.userName }}</div>
          <div class="comment-text">{{ comment.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fb-message-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e6ea;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.fb-message-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  margin-right: 12px;
  text-transform: uppercase;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 15px;
  color: #050505;
  margin-bottom: 2px;
}

.message-time {
  font-size: 13px;
  color: #65676b;
}

.fb-message-content {
  font-size: 16px;
  line-height: 1.5;
  color: #050505;
  margin-bottom: 12px;
  padding: 0 4px;
}

.fb-reactions {
  border-top: 1px solid #e4e6ea;
  padding-top: 12px;
}

.reaction-stats {
  font-size: 13px;
  color: #65676b;
  margin-bottom: 8px;
  padding: 0 4px;
}

.fb-actions {
  display: flex;
  justify-content: space-around;
  gap: 8px;
}

.fb-action-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #65676b;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.fb-action-btn:hover {
  background-color: #f2f3f5;
}

.fb-action-btn.active {
  color: #1877f2;
}

.like-btn.active {
  color: #1877f2;
}

.fb-comment-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e4e6ea;
}

.comment-input-area {
  display: flex;
  gap: 8px;
  align-items: center;
}

.comment-input {
  flex: 1;
  background: #f0f2f5;
  border: none;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
}

.comment-input:focus {
  background: #e4e6ea;
}

.comment-submit-btn {
  background: #1877f2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.comment-submit-btn:hover {
  background: #166fe5;
}

.fb-comments {
  margin-top: 12px;
}

.fb-comment {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
}

.comment-content {
  flex: 1;
  background: #f0f2f5;
  border-radius: 16px;
  padding: 8px 12px;
}

.comment-user {
  font-weight: 600;
  font-size: 13px;
  color: #050505;
  margin-bottom: 2px;
}

.comment-text {
  font-size: 14px;
  color: #050505;
  line-height: 1.4;
}

.fb-individual-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e4e6ea;
  justify-content: flex-end;
}

.fb-individual-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.fb-individual-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.fb-individual-btn.fb-btn {
  background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%);
  box-shadow: 0 2px 8px rgba(24, 119, 242, 0.3);
}

.fb-individual-btn.fb-btn:hover {
  box-shadow: 0 4px 12px rgba(24, 119, 242, 0.4);
}

.fb-individual-btn.fb-view-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.fb-individual-btn.fb-view-btn:hover {
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}
</style>