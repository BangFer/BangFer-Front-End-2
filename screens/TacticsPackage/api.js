import apiClient from './apiClient';

const mockTactics = [
  { tacticId: 1, tacticName: "4-3-3 공격적 전술", famousCoachName: "펩 과르디올라", mainFormation: "4-3-3", nickname: "축구팬1" },
  { tacticId: 2, tacticName: "5-3-2 수비적 전술", famousCoachName: "디에고 시메오네", mainFormation: "5-3-2", nickname: "전술마스터" },
  // ... 더 많은 목업 데이터 ...
];

export const fetchTactics = async ({ page = 0, size = 10, sort = 'tacticId,desc', formation = null }) => {
  // 실제 API 호출 대신 목업 데이터 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        content: mockTactics.slice(page * size, (page + 1) * size),
        number: page,
        size: size,
        totalElements: mockTactics.length,
        totalPages: Math.ceil(mockTactics.length / size),
      });
    }, 500); // 500ms 딜레이로 네트워크 지연 시뮬레이션
  });
};

export const fetchTacticDetail = async (tacticId) => {
  const response = await apiClient.get(`/tactics/${tacticId}`);
  return response.data.result;
};