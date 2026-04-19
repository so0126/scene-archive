---
name: 라우터 import 오류
about: React 웹 앱에서 react-router import 사용으로 생기는 라우팅 오류를 기록합니다.
title: "[front/fix] 홈 화면 라우터 import 경로 오류"
labels: bug
assignees: ""
---

## 요약

브라우저용 React 앱 페이지에서 `react-router`를 직접 import 하면서 라우터 훅과 라우터 생성 함수 해석이 불안정한 문제가 있습니다.

## 재현 위치

- `frontend/src/app/App.tsx`
- `frontend/src/app/routes.tsx`
- `frontend/src/app/pages/Home.tsx`
- `frontend/src/app/pages/Editor.tsx`
- `frontend/src/app/pages/Order.tsx`
- `frontend/src/app/pages/OrderLookup.tsx`
- `frontend/src/app/pages/Success.tsx`
- `frontend/src/app/pages/Upload.tsx`

## 기대 결과

웹 앱 라우팅 관련 import가 `react-router-dom`으로 통일되어 IDE와 런타임에서 안정적으로 동작해야 합니다.

## 실제 결과

`Home.tsx`를 포함한 라우터 사용 페이지에서 import 경로가 혼재되어 타입 해석 및 라우팅 동작 문제가 발생할 수 있습니다.

## 해결 방향

- 웹 전용 라우터 API import를 `react-router-dom`으로 통일합니다.
- 수정 커밋이 머지되면 이 이슈를 닫습니다.
