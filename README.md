# CASMI26 Chemistry Desk

공개 화학 검토 게시판과 실제 MS/MS 구조 추론 사례 가이드입니다.

- 웹사이트: https://ys06146.github.io/casmi26-chemistry-board/
- 질문·댓글: https://github.com/ys06146/casmi26-chemistry-board/issues
- 첫 사례 해설: https://ys06146.github.io/casmi26-chemistry-board/guide.html#worked-example

자료 열람에는 로그인이 필요 없습니다. 글과 댓글은 GitHub 로그인 후 작성합니다. 웹 양식은 초안을 GitHub 작성 화면에 전달하며, 그곳에서 최종 게시합니다. 모든 글과 댓글은 GitHub Issues에 저장됩니다.

## 포함된 자료

기존 RIKEN 확인군의 순위 하락 11건·개선 대조 6건, 실제 관측 44개 스펙트럼, 정답·비교 후보 구조, 분기별 순위와 작성 양식이 들어 있습니다. confirm0003에는 구조 차이·84.081 이온 해석 가설·CO 간격·저장 점수 재현·호변이성질체 처리 차이에 관한 직접 작성 예시가 있습니다.

정확 질량과 구조 해석 가설은 실험으로 확인된 기전과 구분했습니다. 새 모델 추론·튜닝·대회 제출 결과를 추가한 자료가 아닙니다. 이 사례를 본 후 개선 규칙을 만들면 해당 사례들은 개발 자료가 되며, 별도 분자군에서 확인해야 합니다.

## 사용

1. 웹사이트에서 첫 분석 예시를 읽습니다.
2. ‘검토 질문 올리기’에서 관측과 질문을 나누어 적습니다.
3. GitHub에서 최종 게시하고 원문에 댓글로 근거·반례를 남깁니다.
4. 검토 요약과 다음 실험을 기록하고 정리한 이슈는 Close합니다.

과제 가이드의 개인 메모는 해당 브라우저에 저장됩니다. 공유할 메모는 가이드에서 JSON으로 내보낸 뒤 전달합니다. 게시판에 남긴 글과 댓글과는 별도입니다.

## 구현과 배포

빌드가 없는 HTML/CSS/JavaScript입니다. GitHub Pages의 main / root에서 배포합니다. 브라우저에는 자격증명이나 토큰이 들어 있지 않습니다. 목록은 공개 GitHub REST API를 사용하며 실패하면 원문 게시판으로 이동할 수 있습니다.

첫 예시의 계산과 순위 재현 기록은 `data/example-analysis.json`에 있습니다. 출처: [NCBI MeSH](https://www.ncbi.nlm.nih.gov/mesh/68012382), [PubChem](https://pubchem.ncbi.nlm.nih.gov/compound/rolitetracycline), 기존 프로젝트의 저장된 RIKEN 평가 기록. 외부 자료의 권리는 각 원자료의 조건을 따릅니다.
