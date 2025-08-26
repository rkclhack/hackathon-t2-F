<template>
  <div class="report-add-container">
    <button 
      @click="toggleModal" 
      class="report-button"
      :class="{ 'button-active': isModalOpen }"
      :title="'áÃ»ü¸ ' + messageId + ' kÕ£üÉÐÃ¯’á'"
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
      </svg>
      <span class="button-text">FBá</span>
    </button>
    
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">
              <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Õ£üÉÐÃ¯’á
            </h2>
            <button @click="closeModal" class="close-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="message-reference">
              <h4>þaáÃ»ü¸</h4>
              <div class="referenced-message">
                <span class="message-id">ID: {{ messageId }}</span>
                <p class="message-preview">{{ messagePreview || 'áÃ»ü¸×ìÓåüL)(gM~[“' }}</p>
              </div>
            </div>
            
            <form @submit.prevent="submitFeedback" class="feedback-form">
              <div class="form-group">
                <label for="feedbackType" class="form-label">Õ£üÉÐÃ¯¿¤×</label>
                <select 
                  id="feedbackType" 
                  v-model="feedbackForm.type" 
                  class="form-select"
                  required
                >
                  <option value="">xžWfO`UD</option>
                  <option value="positive">=M Ý¸Æ£Ö</option>
                  <option value="negative">=N Í¬Æ£Ö</option>
                  <option value="suggestion">=¡ 9„ÐH</option>
                  <option value="question">S êO</option>
                  <option value="bug">= Ð°ìÝüÈ</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="feedbackContent" class="form-label">
                  Õ£üÉÐÃ¯…¹
                  <span class="character-count">{{ feedbackForm.content.length }}/500</span>
                </label>
                <textarea 
                  id="feedbackContent" 
                  v-model="feedbackForm.content"
                  class="form-textarea"
                  placeholder="s0jÕ£üÉÐÃ¯’Te›O`UD..."
                  rows="4"
                  maxlength="500"
                  required
                ></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">U¡ìÙë</label>
                <div class="rating-container">
                  <div 
                    v-for="rating in 5" 
                    :key="rating"
                    class="star"
                    :class="{ 'star-filled': rating <= feedbackForm.rating }"
                    @click="setRating(rating)"
                  >
                    P
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button type="button" @click="closeModal" class="cancel-button">
                  ­ãó»ë
                </button>
                <button 
                  type="submit" 
                  class="submit-button"
                  :disabled="!isFormValid || isSubmitting"
                >
                  <span v-if="isSubmitting" class="loading-spinner"></span>
                  {{ isSubmitting ? 'á-...' : 'Õ£üÉÐÃ¯á' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
    
    <Transition name="toast">
      <div v-if="showSuccessToast" class="success-toast">
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22,4 12,14.01 9,11.01"></polyline>
        </svg>
        Õ£üÉÐÃ¯’áW~W_
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  messageId: {
    type: String,
    required: true
  },
  messagePreview: {
    type: String,
    default: ''
  }
})

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const showSuccessToast = ref(false)

const feedbackForm = reactive({
  type: '',
  content: '',
  rating: 0
})

const isFormValid = computed(() => {
  return feedbackForm.type && feedbackForm.content.trim().length > 0
})

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
  if (isModalOpen.value) {
    resetForm()
  }
}

const closeModal = () => {
  isModalOpen.value = false
}

const resetForm = () => {
  feedbackForm.type = ''
  feedbackForm.content = ''
  feedbackForm.rating = 0
}

const setRating = (rating) => {
  feedbackForm.rating = rating
}

const submitFeedback = async () => {
  if (!isFormValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // SSgŸ›nAPI|súW’LF
    await simulateFeedbackSubmission()
    
    // ŸBnæ
    showSuccessToast.value = true
    closeModal()
    resetForm()
    
    // Èü¹È’3ÒŒk Y
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
    
  } catch (error) {
    console.error('Õ£üÉÐÃ¯á¨éü:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Õ£üÉÐÃ¯á’·ßåìüÈ
const simulateFeedbackSubmission = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Õ£üÉÐÃ¯á:', {
        messageId: props.messageId,
        type: feedbackForm.type,
        content: feedbackForm.content,
        rating: feedbackForm.rating,
        timestamp: new Date().toISOString()
      })
      resolve()
    }, 1500)
  })
}
</script>

<style scoped>
.report-add-container {
  position: relative;
  display: inline-block;
}

.report-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 3px 10px rgba(240, 147, 251, 0.3);
  position: relative;
  overflow: hidden;
}

.report-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.report-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
}

.report-button:hover::before {
  left: 100%;
}

.button-active {
  background: linear-gradient(135deg, #f5576c 0%, #e91e63 100%);
}

.icon {
  width: 14px;
  height: 14px;
}

.button-text {
  font-size: 11px;
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
  max-width: 500px;
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
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.title-icon {
  width: 24px;
  height: 24px;
  color: #f093fb;
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
  width: 18px;
  height: 18px;
}

.modal-body {
  padding: 24px 32px 32px;
}

.message-reference {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.message-reference h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.referenced-message {
  background: white;
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #f093fb;
}

.message-id {
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
}

.message-preview {
  margin: 8px 0 0 0;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.4;
  font-style: italic;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.character-count {
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
}

.form-select, .form-textarea {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.rating-container {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.star {
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.star:hover {
  transform: scale(1.2);
}

.star-filled {
  filter: brightness(1.2);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.cancel-button, .submit-button {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.cancel-button {
  background: #f3f4f6;
  color: #6b7280;
}

.cancel-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.submit-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

.success-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  z-index: 1001;
}

.toast-icon {
  width: 20px;
  height: 20px;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-header, .modal-body {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .success-toast {
    top: 10px;
    right: 10px;
    left: 10px;
  }
}
</style>