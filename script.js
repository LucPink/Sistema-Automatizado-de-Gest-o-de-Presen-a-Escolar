const students = [
    "Ana Silva", "João Pereira", "Maria Santos", "Pedro Costa", "Sofia Silva",
    "António Gomes", "Luísa Fernandes", "Ricardo Almeida", "Inês Oliveira", "Miguel Rodrigues"
];

let attendanceData = {}; // Armazena os dados de presença

function showSection(sectionId) {
    document.getElementById('inicio').style.display = sectionId === 'inicio' ? 'block' : 'none';
    document.getElementById('presenca').style.display = sectionId === 'presenca' ? 'block' : 'none';
    document.getElementById('aluno').style.display = sectionId === 'aluno' ? 'block' : 'none';
    if (sectionId === 'presenca') {
        createAttendanceList();
    } else if (sectionId === 'aluno') {
        updateStudentListAluno();
    } else if (sectionId === 'inicio') {
        updateChart();
    }
}

function createAttendanceList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach(student => {
        const li = document.createElement('li');
        li.innerHTML = `${student}: 
          <input type="radio" name="${student}" value="presente">Presente 
          <input type="radio" name="${student}" value="ausente">Ausente 
          <input type="radio" name="${student}" value="justificado">Justificado`;
        studentList.appendChild(li);
    });
}

function submitAttendance() {
    const attendanceDataTemp = {};
    const form = document.getElementById('attendanceForm');
    const inputs = form.querySelectorAll('input[type="radio"]:checked');

    inputs.forEach(input => {
        const studentName = input.name;
        const status = input.value;
        if (!attendanceDataTemp[studentName]) {
            attendanceDataTemp[studentName] = { presente: 0, ausente: 0, justificado: 0 };
        }
        attendanceDataTemp[studentName][status]++;
    });

    for (const student in attendanceDataTemp) {
        if (!attendanceData[student]) {
            attendanceData[student] = { presente: 0, ausente: 0, justificado: 0 };
        }
        attendanceData[student].presente += attendanceDataTemp[student].presente;
        attendanceData[student].ausente += attendanceDataTemp[student].ausente;
        attendanceData[student].justificado += attendanceDataTemp[student].justificado;
    }

    alert("Presença enviada!");
    updateChart(); // Atualiza o gráfico após o envio
}

function updateStudentListAluno() {
    const studentListAluno = document.getElementById('studentListAluno');
    studentListAluno.innerHTML = '';

    for (const student of students) {
        const li = document.createElement('li');
        li.textContent = student;
        li.addEventListener('click', () => showStudentAttendance(student));
        studentListAluno.appendChild(li);
    }
}

function showStudentAttendance(studentName) {
    if (!attendanceData[studentName]) {
        alert(`Nenhum dado de presença registrado para ${studentName}.`);
        return;
    }
    const data = attendanceData[studentName];
    alert(`Presenças: ${data.presente || 0}, Ausentes: ${data.ausente || 0}, Justificadas: ${data.justificado || 0}`);
}

/* Função para criar e atualizar o gráfico */
let chart;

function updateChart() {
    const totalStudents = students.length;
    const totals = { presente: 0, ausente: 0, justificado: 0 };

    for (const student in attendanceData) {
        totals.presente += attendanceData[student].presente || 0;
        totals.ausente += attendanceData[student].ausente || 0;
        totals.justificado += attendanceData[student].justificado || 0;
    }

    const averages = {
        presente: totals.presente / totalStudents || 0,
        ausente: totals.ausente / totalStudents || 0,
        justificado: totals.justificado / totalStudents || 0
    };

    const ctx = document.getElementById('attendanceChart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Presente', 'Ausente', 'Justificado'],
            datasets: [{
                data: [averages.presente, averages.ausente, averages.justificado],
                backgroundColor: ['#4CAF50', '#f44336', '#ff9800']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Inicializa a página
showSection('inicio');
