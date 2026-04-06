import { create } from 'zustand';

interface BookState {
  bookUid: string | null;
  isCreating: boolean;
  initBook: () => Promise<void>;
  setBookUid: (uid: string) => void;
}

export const useBookStore = create<BookState>((set) => ({
  bookUid: sessionStorage.getItem('current_book_uid'), // 새로고침해도 유지되게 초기값 설정
  isCreating: false,

  setBookUid: (uid) => {
    sessionStorage.setItem('current_book_uid', uid);
    set({ bookUid: uid });
  },

  initBook: async () => {
    set({ isCreating: true });
    try {
      const response = await fetch('http://localhost:8000/api/book/init', { method: 'POST' });
      const data = await response.json();

      // 상태 업데이트와 동시에 세션 스토리지에도 저장
      sessionStorage.setItem('current_book_uid', data.book_uid);
      set({ bookUid: data.book_uid });
    } catch (error) {
      console.error("책 생성 에러:", error);
    } finally {
      set({ isCreating: false });
    }
  },
}));