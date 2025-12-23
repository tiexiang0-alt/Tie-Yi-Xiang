document.addEventListener('DOMContentLoaded', () => {
    // 1. Countdown Logic
    // 1. Countdown Logic (Persistent)
    const timerElement = document.getElementById('countdown-timer');
    const STORAGE_KEY = 'tieyixiang_start_time';

    // Get stored start time or set to now if new
    let startTime = localStorage.getItem(STORAGE_KEY);
    if (!startTime) {
        startTime = new Date().getTime();
        localStorage.setItem(STORAGE_KEY, startTime);
    } else {
        startTime = parseInt(startTime);
    }

    // Deadline is fixed 20 days from the FIRST time the user opened the site
    const deadline = new Date(startTime + (20 * 24 * 60 * 60 * 1000));

    // Expose for dashboard
    window.getDiff = () => {
        return deadline - new Date();
    };

    if (timerElement) {
        function updateTimer() {
            const diff = window.getDiff();

            if (diff <= 0) {
                timerElement.textContent = "行动结束";
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Style: Large Days, smaller time
            timerElement.innerHTML = `<span style="font-size: 1.2em; color: var(--system-red);">${days}天</span> ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            requestAnimationFrame(updateTimer);
        }
        updateTimer();
    }

    // 2. Clock Logic (Hub)
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        setInterval(() => {
            const now = new Date();
            clockElement.textContent = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }, 1000);
    }
});

// 3. Todo Logic (Exported function to be called in timeline.html)
function initTodo() {
    const list = document.getElementById('todo-list');
    const input = document.getElementById('new-task-input');
    const btn = document.getElementById('add-task-btn');

    // Default Tasks from Strategy
    const defaultTasks = [
        { text: "购买羊肉专用新碗 (明天上午)", done: false, deadline: "Day 1" },
        { text: "认证小红书/抖音企业号 (明天全天)", done: false, deadline: "Day 1" },
        { text: "燕回 & 厨师 喊堂口号培训", done: false, deadline: "Day 2" },
        { text: "联系首批8-10位探店达人", done: false, deadline: "Day 3" },
        { text: "拍摄'15年老店'宣传素材", done: false, deadline: "Day 4" }
    ];

    // Load from local storage or defaults
    let tasks = JSON.parse(localStorage.getItem('tieyixiang_tasks')) || defaultTasks;

    function render() {
        list.innerHTML = '';
        tasks.forEach((task, index) => {
            const item = document.createElement('div');
            item.className = `todo-item ${task.done ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="todo-checkbox" onclick="toggleTask(${index})"></div>
                <div class="todo-text">
                    <div>${task.text}</div>
                    <div style="font-size:10px; color: #FFD60A; margin-top:2px;">截止: ${task.deadline}</div>
                </div>
                <div style="margin-left:auto; opacity:0.3; cursor:pointer;" onclick="deleteTask(${index})">✕</div>
            `;
            list.appendChild(item);
        });
        localStorage.setItem('tieyixiang_tasks', JSON.stringify(tasks));
    }

    window.toggleTask = (index) => {
        tasks[index].done = !tasks[index].done;
        render();
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        render();
    };

    function addTask() {
        const val = input.value.trim();
        if (val) {
            tasks.unshift({ text: val, done: false, deadline: "自定" });
            input.value = '';
            render();
        }
    }

    btn.addEventListener('click', addTask);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    render();
}
// 4. Accordion Logic (Operations Page & Manual Page)
document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.glass-sheet h2');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sheet = header.parentElement;
            sheet.classList.toggle('collapsed');
        });
    });
});
