// Загружаем существующие данные из памяти браузера (LocalStorage)
let reports = JSON.parse(localStorage.getItem('hms_reports')) || [];

const form = document.getElementById('hmsForm');
const reportsList = document.getElementById('reportsList');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const editIndexField = document.getElementById('editIndex');

// Отображаем отчеты при загрузке страницы
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
        // Добавление (Create)
        reports.push(reportData);
    } else {
        // Редактирование (Update)
        reports[index] = reportData;
        resetFormStatus();
    }

    saveAndRefresh();
    form.reset();
});

function saveAndRefresh() {
    localStorage.setItem('hms_reports', JSON.stringify(reports));
    renderReports();
}

function renderReports() {
    reportsList.innerHTML = "";
    reports.forEach((report, index) => {
        const card = document.createElement('div');
        card.className = `report-card ${report.severity === 'Høy' ? 'high' : ''}`;
        card.innerHTML = `
            <div><strong>${report.category}</strong> <span style="float:right; font-size:11px; color:#64748b;">${report.date}</span></div>
            <p style="margin: 10px 0;">${report.description}</p>
            <div style="font-size: 13px;">Status: <strong>${report.severity} Prioritet</strong></div>
            <div class="card-actions">
                <button class="btn-edit" onclick="editReport(${index})">Rediger</button>
                <button class="btn-delete" onclick="deleteReport(${index})">Slett</button>
            </div>
        `;
        reportsList.appendChild(card);
    });
}

function deleteReport(index) {
    if(confirm("Vil du slette denne HMS-rapporten?")) {
        reports.splice(index, 1); // Удаление (Delete)
        saveAndRefresh();
    }
}

function editReport(index) {
    const report = reports[index];
    document.getElementById('category').value = report.category;
    document.getElementById('severity').value = report.severity;
    document.getElementById('description').value = report.description;
    
    editIndexField.value = index;
    submitBtn.innerText = "Lagre endringer";
    submitBtn.style.background = "#10b981"; // Зеленый цвет при редактировании
    formTitle.innerText = "Rediger HMS-avvik";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetFormStatus() {
    submitBtn.innerText = "Registrer avvik";
    submitBtn.style.background = "#003366";
    formTitle.innerText = "Meld fra om HMS-avvik";
    editIndexField.value = "-1";
}