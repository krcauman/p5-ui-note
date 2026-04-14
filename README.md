Problem Definition

On tablets and 2-in-1 laptops, users often experience unintended system UI activation while writing.
This occurs when the wrist or palm touches the bottom taskbar area, interrupting input and breaking the flow of handwriting.

Current Limitations

Existing palm rejection features can distinguish between pen and touch input, limiting some unintended touches.
However,this functionality is limited to input differentiation and does not control interactions with system UI elements such as the taskbar. 
As a result, the taskbar remains active during writing, causing conflicts between intended input and UI responses.

Proposed Solution
This project proposes an interaction model that dynamically controls UI responsiveness based on the input context.
1. When writing mode is enabled, the taskbar remains visually visible but becomes non-interactive to touch input.
2. When writing mode is disabled, the taskbar behaves as usual and remains fully interactive.

This approach reduces accidental interactions during writing, preserves the input flow, and improves the user experience without requiring changes to the existing UI structure.

문제 정의

태블릿 및 2in1 노트북 환경에서 필기 중 손목이나 손바닥이 화면 하단 작업표시줄 영역에 닿으면서 의도하지 않은 시스템 UI가 활성화되는 문제가 발생함. 이로 인해 입력이 중단되고 필기 흐름이 끊기는 불편함이 존재함.

현재 한계

기존의 palm rejection 기능은 손과 펜 입력을 구분하여 일부 터치 입력을 제한함. 그러나 해당 기능은 입력 장치 구분에 한정되며 작업표시줄과 같은 시스템 UI의 터치 반응까지 제어하지는 못함. 
따라서 필기 중에도 하단 UI는 활성 상태로 유지되어 입력 의도와 UI 반응 간 충돌이 발생하는 한계가 존재함.

해결 방향

본 프로젝트에서는 입력 상황에 따라 UI 반응을 제어하는 인터랙션을 제안함. 
1. 필기 모드 활성화 시 하단 UI 영역은 시각적으로 유지되지만 터치 입력은 차단되도록 함. 
2. 반대로 필기 모드 비활성화 시에는 기존과 동일하게 UI를 사용할 수 있도록 함.

이를 통해 필기 중 오작동을 줄이고 입력 흐름을 유지할 수 있으며 기존 UI 구조를 변경하지 않으면서도 상황 기반 UX 개선이 가능함.
