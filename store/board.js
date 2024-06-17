import { create } from 'zustand';

export const useBoardStore = create((set) => ({
  boards: [
    {
      _id: '1',
      title: '첫번째 게시물 제목',
      contents: '첫번째 게시물 내용',
      categories: ['카테고리1', '카테고리2'],
      files: [],
      comments: [],
    },
    {
      _id: '3ab43799-0bc9-4ad6-aa6f-02f81740a110',
      title: '두번째 게시물 제목',
      contents: '두번째 게시물 내용',
      categories: [],
      files: [],

      comments: [],
    },
    {
      _id: '24f97bdd-057c-4687-87ea-7abe98457fe7',
      categories: ['축구', '전술', '경기장'],
      contents:
        '현재 사용가능한 축구 경기장 구합니다. \n서울시 000구 000동 쪽 근처에서 15:00시부터 18:00까지 사용가능한 축구장 있나요?',
      files: ['file:///Users/storage/emulated/O/Pictures/IMG_20240'],
      title: '세번째 게시물 제목',
      comments: [],
    },
  ],
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  removeBoard: (_id) =>
    set((state) => ({ boards: state.boards.filter((b) => b._id !== _id) })),

  updateBoard: (_id, _board) =>
    set((state) => ({
      boards: state.boards.map((board) => {
        if (board._id === _id) {
          return _board;
        } else {
          return board;
        }
      }),
    })),

  addComment: (_id, comment) => {
    set((state) => ({
      boards: state.boards.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            comments: [...item.comments, comment],
          };
        } else {
          return item;
        }
      }),
    }));
  },
}));
