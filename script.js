// 1. Демонстрационные данные (Mock data) на норвежском
// Эти данные зашиты в код и будут видны всем всегда
const demoReports = [
    {
        category: "Fysisk arbeidsmiljø",
        severity: "Høy",
        description: "Løse fliser i trappen ved hovedinngangen. Stor snublefare for elever og ansatte.",
        date: "05.05.2026, 09:00:00"
    },
    {
        category: "Inneklima",
        severity: "Middels",
        description: "Ventilasjonsanlegget i klasserom 302 bråker veldig høyt, noe som forstyrrer undervisningen.",
        date: "06.05.2026, 10:30:00"
    },
    {
        category: "Utstyr",
        severity: "Lav",
        description: "Ønske om flere ergonomiske tastaturer på datarommet.",
        date: "06.05.2026, 11:15:00"
    }
];

// Загружаем данные пользователя из LocalStorage
let userReports = JSON.parse(localStorage.getItem('hms_reports')) || [];

// Объединяем демо-данные и данные пользователя для отображения
let reports = [...demoReports, ...userReports];

const form = document.getElementById('hmsForm');
const reportsList = document.getElementById('reportsList');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const editIndexField = document.getElementById('editIndex');

// Рисуем отчеты при загрузке
renderReports();

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const reportData = {
        category: document.getElementById('category').value,
        severity: document.getElementById('severity').value,
        description: document.getElementById('description').value,
        date: new Date().toLocaleString()
    };

    const index = parseInt(editIndexField.value);

    if (index === -1) {
        // Добавляем в список пользователя
        userReports.push(reportData);
    } else {
        // Если редактируем, сохраняем изменения в пользовательский список
        // (Индекс корректируется с учетом демо-данных)
        if (index >= demoReports.length) {
            userReports[index - demoReports.length] = reportData;
        }
        resetFormStatus();
    }

    saveAndRefresh();
    form.reset();
});

function saveAndRefresh() {
    // Сохраняем в память ТОЛЬКО отчеты пользователя
    localStorage.setItem('hms_reports', JSON.stringify(userReports));
    // Снова объединяем для обновления экрана
    reports = [...demoReports, ...userReports];
    renderReports();
}

function renderReports() {
    reportsList.innerHTML = "";
    reports.forEach((report, index) => {
        const card = document.createElement('div');
        card.className = `report-card ${report.severity === 'Høy' ? 'high' : ''}`;
        
        // Проверяем, является ли пост демонстрационным
        const isDemo = index < demoReports.length;

        card.innerHTML = `
            <div><strong>${report.category}</strong> <span style="float:right; font-size:11px; color:#64748b;">${report.date}</span></div>
            <p style="margin: 10px 0;">${report.description}</p>
            <div style="font-size: 13px;">Status: <strong>${report.severity} Prioritet</strong></div>
            <div class="card-actions">
                ${!isDemo ? `
                    <button class="btn-edit" onclick="editReport(${index})">Rediger</button>
                    <button class="btn-delete" onclick="deleteReport(${index})">Slett</button>
                ` : `<em style="color: #94a3b8; font-size: 12px;">Systeminnlegg (Demo)</em>`}
            </div>
        `;
        reportsList.appendChild(card);
    });
}

function deleteReport(index) {
    if (index < demoReports.length) {
        alert("Демо-посты нельзя удалить.");
        return;
    }

    if(confirm("Vil du slette denne HMS-rapporten?")) {
        userReports.splice(index - demoReports.length, 1);
        saveAndRefresh();
    }
}

function editReport(index) {
    if (index < demoReports.length) {
        alert("Демо-посты нельзя редактировать.");
        return;
    }

    const report = reports[index];
    document.getElementById('category').value = report.category;
    document.getElementById('severity').value = report.severity;
    document.getElementById('description').value = report.description;
    
    editIndexField.value = index;
    submitBtn.innerText = "Lagre endringer";
    submitBtn.style.background = "#10b981"; 
    formTitle.innerText = "Rediger HMS-avvik";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetFormStatus() {
    submitBtn.innerText = "Registrer avvik";
    submitBtn.style.background = "#003366";
    formTitle.innerText = "Meld fra om HMS-avvik";
    editIndexField.value = "-1";
}
