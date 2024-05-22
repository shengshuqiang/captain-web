import { reactive } from 'vue';
import Swal from 'sweetalert2';
import {TIME_RADIO_KEY_VALUE_OBJ, QUESTION_RADIO_KEY_VALUE_OBJ,
    type SettingData, type UseSetting,
} from './constant';
export const useSetting = (newGame: () => void, continueGame: () => void): UseSetting => {
  const data: SettingData = reactive({
    isAdd: true,
    numberRange: 20,
    limitTime: 2 * 60 * 1000,
    questionCount: 20
  })
  const show = () => {
      Swal.fire({
          icon: "info",
          title: "请选择运算类型和范围",
          html: `
            <div
            style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            "
            >
                <div class="swal2-radio" style="display: flex">
                    <label>
                    <input type="radio" name="addSub-radio" id="add" ${(data.isAdd) ? 'checked' : ''}/>
                    <span class="swal2-label">进位加法</span>
                    </label>
                    <label>
                    <input type="radio" name="addSub-radio" id="sub" ${(!data.isAdd) ? 'checked' : ''}/>
                    <span class="swal2-label">退位减法</span>
                    </label>
                </div>
                <select id="range" class="swal2-select" style="display: flex">
                    <option value="" disabled="">请选择</option>
                    <option value="20" ${(data.numberRange === 20) ? 'selected' : ''} >20以内</option>
                    <option value="30" ${(data.numberRange === 30) ? 'selected' : ''}>30以内</option>
                    <option value="40" ${(data.numberRange === 40) ? 'selected' : ''}>40以内</option>
                    <option value="50" ${(data.numberRange === 50) ? 'selected' : ''}>50以内</option>
                    <option value="60" ${(data.numberRange === 60) ? 'selected' : ''}>60以内</option>
                    <option value="80" ${(data.numberRange === 80) ? 'selected' : ''}>80以内</option>
                    <option value="100" ${(data.numberRange === 100) ? 'selected' : ''}>100以内</option>
                </select>
                <div class="swal2-radio" style="display: flex">
                    <label>
                    <input type="radio" name="time-radio" id="time-2min" ${(data.limitTime === 2 * 60 * 1000) ? 'checked' : ''}/>
                    <span class="swal2-label">2分钟</span>
                    </label>
                    <label>
                    <input type="radio" name="time-radio" id="time-5min" ${(data.limitTime === 5 * 60 * 1000) ? 'checked' : ''}/>
                    <span class="swal2-label">5分钟</span>
                    </label>
                    <label>
                    <input type="radio" name="time-radio" id="time-10min" ${(data.limitTime === 10 * 60 * 1000) ? 'checked' : ''}/>
                    <span class="swal2-label">10分钟</span>
                    </label>
                </div>
                <div id="question" class="swal2-radio" style="display: flex" value="question-20">
                    <label>
                    <input type="radio" name="question-radio" id="question-20" ${(data.questionCount === 20) ? 'checked' : ''}/>
                    <span class="swal2-label">20题</span>
                    </label>
                    <label>
                    <input type="radio" name="question-radio" id="question-50" ${(data.questionCount === 50) ? 'checked' : ''}/>
                    <span class="swal2-label">50题</span>
                    </label>
                    <label>
                    <input type="radio" name="question-radio" id="question-100" ${(data.questionCount === 100) ? 'checked' : ''}/>
                    <span class="swal2-label">100题</span>
                    </label>
                </div>
            </div>
        `,
          confirmButtonText: '确认',
          preConfirm: () => {
              const checkedAddSubRadio = document.querySelector('[name=addSub-radio]:checked');
              data.isAdd = checkedAddSubRadio?.id === 'add';
              const rangeSelect = document.querySelector('#range');
              data.numberRange = +(rangeSelect ? rangeSelect.value : '');
              const checkedTimeRadio = document.querySelector('[name=time-radio]:checked');
              data.limitTime = TIME_RADIO_KEY_VALUE_OBJ[checkedTimeRadio?.id || ''];
              const checkedQuestionRadio = document.querySelector('[name=question-radio]:checked');
              data.questionCount = QUESTION_RADIO_KEY_VALUE_OBJ[checkedQuestionRadio?.id || ''];
              
              console.log('SSU Swal.fire', data)
          }
      }).then((result) => {
        if (result.isConfirmed) {
            newGame();
        } else {
            continueGame();
        }
      });;
  }
  return { show, data };
}

