const SUBJECTS = [
    'Chemistry', 'Physics', 'Biology', 'Math', 'Statistics',
    'Social Science', 'English', 'Filipino', 'Computer Science', 'PEHM'
];

const ALLOWED_GRADES = [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 4.00, 5.00];

const SUBJECT_COLORS = [
    '#A8DADC', '#457B9D', '#F1FAEE', '#E63946', '#2A9D8F',
    '#E76F51', '#F4A261', '#E9C46A', '#264653', '#8AB17D'
];

const SUBJECT_ICONS = ['⚗', '⚛', '🧬', '∑', '📈', '🌍', '📝', '🇵🇭', '💻', '⚽'];

// Grade component templates for each subject
const GRADE_TEMPLATES = {
    'Chemistry': [
        { category: 'Quiz / FA', weight: 0.25 },
        { category: 'LT / SA', weight: 0.35 },
        { category: 'AA / LA', weight: 0.40 }
    ],
    'Physics': [
        { category: 'Quiz / FA', weight: 0.25 },
        { category: 'AA', weight: 0.25 },
        { category: 'LT1', weight: 0.25 },
        { category: 'LT2', weight: 0.25 }
    ],
    'Biology': [
        { category: 'Final LT', weight: 0.25 },
        { category: 'LT1, LT2, Quiz / FA', weight: 0.30 },
        { category: 'LA', weight: 0.25 },
        { category: 'AA', weight: 0.20 }
    ],
    'Math': [
        { category: 'Quiz / FA', weight: 0.25 },
        { category: 'SW and HW', weight: 0.05 },
        { category: 'LT1', weight: 0.25 },
        { category: 'LT2', weight: 0.25 },
        { category: 'AA', weight: 0.20 }
    ],
    'Statistics': [
        { category: 'Quiz / FA', weight: 0.20 },
        { category: 'Mini Tasks', weight: 0.05 },
        { category: 'LA', weight: 0.25 },
        { category: 'Project', weight: 0.25 },
        { category: 'LT', weight: 0.25 }
    ],
    'Social Science': [
        { category: 'Quiz / FA', weight: 0.25 },
        { category: 'LT', weight: 0.35 },
        { category: 'AA', weight: 0.40 }
    ],
    'English': [
        { category: 'Quiz / FA', weight: 0.25 },
        { category: 'LT', weight: 0.35 },
        { category: 'AA', weight: 0.40 }
    ],
    'Filipino': [
        { category: 'Quiz / FA', weight: 0.25 },
        { category: 'LT', weight: 0.35 },
        { category: 'AA', weight: 0.40 }
    ],
    'Computer Science': [
        { category: 'Quiz / FA', weight: 0.25 },
        { category: 'LT', weight: 0.35 },
        { category: 'AA', weight: 0.40 }
    ],
    'PEHM': [
        { category: 'Quiz / FA', weight: 0.25 },
        { category: 'LT', weight: 0.35 },
        { category: 'AA', weight: 0.40 }
    ]
};

// Transmutation function
function transmute(rawGrade) {
    if (rawGrade >= 1.000 && rawGrade <= 1.125) return 1.00;
    if (rawGrade >= 1.126 && rawGrade <= 1.375) return 1.25;
    if (rawGrade >= 1.376 && rawGrade <= 1.625) return 1.50;
    if (rawGrade >= 1.626 && rawGrade <= 1.875) return 1.75;
    if (rawGrade >= 1.876 && rawGrade <= 2.125) return 2.00;
    if (rawGrade >= 2.126 && rawGrade <= 2.375) return 2.25;
    if (rawGrade >= 2.376 && rawGrade <= 2.625) return 2.50;
    if (rawGrade >= 2.626 && rawGrade <= 2.875) return 2.75;
    if (rawGrade >= 2.876 && rawGrade <= 3.500) return 3.00;
    if (rawGrade >= 3.501 && rawGrade <= 4.500) return 4.00;
    if (rawGrade >= 4.501 && rawGrade <= 5.000) return 5.00;
    return 5.00;
}

function percentageToGrade(percentage) {
    if (percentage >= 96) return 1.00;
    if (percentage >= 90) return 1.25;
    if (percentage >= 84) return 1.50;
    if (percentage >= 78) return 1.75;
    if (percentage >= 72) return 2.00;
    if (percentage >= 66) return 2.25;
    if (percentage >= 60) return 2.50;
    if (percentage >= 55) return 2.75;
    if (percentage >= 50) return 3.00;
    if (percentage >= 40) return 4.00;
    return 5.00;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    updateDashDate();
    renderGWAPage();
    renderGradeCalculator();
});

function initializeData() {
    if (!localStorage.getItem('subjects')) {
        const initialData = {};
        SUBJECTS.forEach(subject => {
            initialData[subject] = {
                previous: 1.00,
                tentative: 1.00,
                final: 1.00
            };
        });
        localStorage.setItem('subjects', JSON.stringify(initialData));
    }

    if (!localStorage.getItem('gradeComponents')) {
        localStorage.setItem('gradeComponents', JSON.stringify({}));
    }
}

function updateDashDate() {
    const now = new Date();
    const options = { day: 'numeric', month: 'short' };
    document.getElementById('dashDate').textContent = 'Today ' + now.toLocaleDateString('en-US', options);
}

function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(page).classList.add('active');

    const navItems = document.querySelectorAll('.nav-item');
    if (page === 'dashboard') navItems[0].classList.add('active');
    if (page === 'gwa') navItems[1].classList.add('active');
    if (page === 'grade') navItems[2].classList.add('active');

    if (page === 'gwa') renderGWAPage();
    if (page === 'grade') renderGradeCalculator();
}

function renderGWAPage() {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    const container = document.getElementById('subjectsList');
    container.innerHTML = '';

    SUBJECTS.forEach((subject, index) => {
        const data = subjects[subject];
        const div = document.createElement('div');
        div.className = 'subject-item';
        div.innerHTML = `
            <div class="subject-header-row">
                <div class="subject-name">
                    <div class="subject-icon" style="border-color: ${SUBJECT_COLORS[index]};">
                        <span class="wingding">${SUBJECT_ICONS[index]}</span>
                    </div>
                    <div class="subject-title">${subject}</div>
                </div>
                <div class="subject-grade">${data.final.toFixed(2)}</div>
            </div>
            <div class="grade-inputs-row">
                <div class="input-box">
                    <label>Previous Grade</label>
                    <select onchange="updateSubjectGrade('${subject}', 'previous', this.value)">
                        ${ALLOWED_GRADES.map(g =>
            `<option value="${g}" ${g === data.previous ? 'selected' : ''}>${g.toFixed(2)}</option>`
        ).join('')}
                    </select>
                </div>
                <div class="input-box">
                    <label>Tentative Grade</label>
                    <select onchange="updateSubjectGrade('${subject}', 'tentative', this.value)">
                        ${ALLOWED_GRADES.map(g =>
            `<option value="${g}" ${g === data.tentative ? 'selected' : ''}>${g.toFixed(2)}</option>`
        ).join('')}
                    </select>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    updateGWARing();
}

function updateSubjectGrade(subject, field, value) {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    subjects[subject][field] = parseFloat(value);

    const prev = subjects[subject].previous;
    const tent = subjects[subject].tentative;
    const rawFinal = (tent * 2 + prev) / 3;
    subjects[subject].final = transmute(rawFinal);

    localStorage.setItem('subjects', JSON.stringify(subjects));
    renderGWAPage();
}

function updateGWARing() {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    const grades = SUBJECTS.map(s => subjects[s].final);

    // Calculate simple average GWA
    const gwa = grades.reduce((a, b) => a + b, 0) / grades.length;
    document.getElementById('gwaNumber').textContent = gwa.toFixed(2);

    const svg = document.getElementById('gwaRing');
    svg.innerHTML = '';

    const centerX = 140;
    const centerY = 140;
    const radius = 110;
    const strokeWidth = 20;

    // Equal segments for each subject
    const segmentAngle = 360 / grades.length;
    let currentAngle = -90;

    grades.forEach((grade, index) => {
        const startAngle = currentAngle * Math.PI / 180;
        const endAngle = (currentAngle + segmentAngle) * Math.PI / 180;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const largeArc = segmentAngle > 180 ? 1 : 0;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`);
        path.setAttribute('stroke', SUBJECT_COLORS[index]);
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');

        svg.appendChild(path);

        currentAngle += segmentAngle;
    });

    // Add icons
    const iconsContainer = document.getElementById('ringIcons');
    iconsContainer.innerHTML = '';

    const iconRadius = 140;
    currentAngle = -90;

    grades.forEach((grade, index) => {
        const midAngle = (currentAngle + segmentAngle / 2) * Math.PI / 180;

        const x = 140 + iconRadius * Math.cos(midAngle);
        const y = 140 + iconRadius * Math.sin(midAngle);

        const iconDiv = document.createElement('div');
        iconDiv.className = 'ring-icon';
        iconDiv.style.left = x + 'px';
        iconDiv.style.top = y + 'px';
        iconDiv.style.transform = 'translate(-50%, -50%)';
        iconDiv.style.borderColor = SUBJECT_COLORS[index];
        iconDiv.innerHTML = `<span class="wingding">${SUBJECT_ICONS[index]}</span>`;
        iconsContainer.appendChild(iconDiv);

        currentAngle += segmentAngle;
    });
}

function renderGradeCalculator() {
    const select = document.getElementById('gradeSubjectSelect');
    select.innerHTML = '<option value="">Choose a subject...</option>';
    SUBJECTS.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        select.appendChild(option);
    });

    renderConversionTable();
    updatePercentageRing(0);
}

function loadGradeComponents() {
    const subject = document.getElementById('gradeSubjectSelect').value;
    const container = document.getElementById('gradeComponentsContainer');

    if (!subject) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    const components = JSON.parse(localStorage.getItem('gradeComponents'));
    if (!components[subject]) {
        components[subject] = {};
        const template = GRADE_TEMPLATES[subject];
        template.forEach(cat => {
            components[subject][cat.category] = {
                weight: cat.weight,
                items: []
            };
        });
        localStorage.setItem('gradeComponents', JSON.stringify(components));
    }

    renderComponents();
}

function addItemToCategory(category) {
    const subject = document.getElementById('gradeSubjectSelect').value;
    const components = JSON.parse(localStorage.getItem('gradeComponents'));

    components[subject][category].items.push({
        score: 0,
        total: 100
    });

    localStorage.setItem('gradeComponents', JSON.stringify(components));
    renderComponents();
}

function renderComponents() {
    const subject = document.getElementById('gradeSubjectSelect').value;
    const components = JSON.parse(localStorage.getItem('gradeComponents'));
    const list = document.getElementById('componentsList');

    list.innerHTML = '';

    const template = GRADE_TEMPLATES[subject];

    template.forEach(catTemplate => {
        const category = catTemplate.category;
        const categoryData = components[subject][category];

        const section = document.createElement('div');
        section.className = 'category-section';

        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <div class="category-title">${category}</div>
            <div class="category-weight">${(categoryData.weight * 100).toFixed(0)}%</div>
        `;
        section.appendChild(header);

        // Add button
        const addBtn = document.createElement('button');
        addBtn.className = 'category-btn-add';
        addBtn.textContent = `+ Add ${category}`;
        addBtn.onclick = () => addItemToCategory(category);
        section.appendChild(addBtn);

        if (categoryData.items.length === 0) {
            const empty = document.createElement('p');
            empty.style.color = '#7f8c8d';
            empty.style.fontSize = '13px';
            empty.style.marginTop = '8px';
            empty.textContent = 'No items added yet';
            section.appendChild(empty);
        } else {
            categoryData.items.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'component-item';
                itemDiv.innerHTML = `
                    <div class="component-row">
                        <input type="number" placeholder="Score" value="${item.score}" 
                               oninput="updateItem('${category}', ${index}, 'score', this.value)">
                        <input type="number" placeholder="Total" value="${item.total}" 
                               oninput="updateItem('${category}', ${index}, 'total', this.value)">
                        <button class="btn-delete-small" onclick="deleteItem('${category}', ${index})">×</button>
                    </div>
                `;
                section.appendChild(itemDiv);
            });
        }

        list.appendChild(section);
    });

    calculateGrade();
}

function updateItem(category, index, field, value) {
    const subject = document.getElementById('gradeSubjectSelect').value;
    const components = JSON.parse(localStorage.getItem('gradeComponents'));

    components[subject][category].items[index][field] = parseFloat(value) || 0;

    localStorage.setItem('gradeComponents', JSON.stringify(components));
    calculateGrade();
}

function deleteItem(category, index) {
    const subject = document.getElementById('gradeSubjectSelect').value;
    const components = JSON.parse(localStorage.getItem('gradeComponents'));

    components[subject][category].items.splice(index, 1);
    localStorage.setItem('gradeComponents', JSON.stringify(components));
    renderComponents();
}

function calculateGrade() {
    const subject = document.getElementById('gradeSubjectSelect').value;
    const components = JSON.parse(localStorage.getItem('gradeComponents'));

    let weightedSum = 0;
    let hasItems = false;

    Object.keys(components[subject]).forEach(category => {
        const categoryData = components[subject][category];

        if (categoryData.items.length > 0) {
            hasItems = true;
            let categoryScore = 0;
            let categoryTotal = 0;

            categoryData.items.forEach(item => {
                categoryScore += item.score;
                categoryTotal += item.total;
            });

            const categoryPercentage = categoryTotal > 0 ? (categoryScore / categoryTotal) * 100 : 0;
            weightedSum += categoryPercentage * categoryData.weight;
        }
    });

    if (!hasItems) {
        document.getElementById('percentageNum').innerHTML = '0<span>%</span>';
        document.getElementById('gradeNum').textContent = 'Grade: -';
        updatePercentageRing(0);
        highlightConversionRow(-1);
        return;
    }

    const finalPercentage = weightedSum;
    const grade = percentageToGrade(finalPercentage);

    document.getElementById('percentageNum').innerHTML = Math.round(finalPercentage) + '<span>%</span>';
    document.getElementById('gradeNum').textContent = 'Grade: ' + grade.toFixed(2);
    updatePercentageRing(finalPercentage);
    highlightConversionRow(finalPercentage);
}

function updatePercentageRing(percentage) {
    const svg = document.getElementById('percentageRing');
    svg.innerHTML = '';

    const centerX = 160;
    const centerY = 160;
    const radius = 130;
    const strokeWidth = 24;

    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', centerX);
    bgCircle.setAttribute('cy', centerY);
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', '#ECF0F1');
    bgCircle.setAttribute('stroke-width', strokeWidth);
    svg.appendChild(bgCircle);

    const progress = Math.min(percentage / 100, 1);
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - progress);

    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', centerX);
    progressCircle.setAttribute('cy', centerY);
    progressCircle.setAttribute('r', radius);
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', '#2C3E50');
    progressCircle.setAttribute('stroke-width', strokeWidth);
    progressCircle.setAttribute('stroke-dasharray', circumference);
    progressCircle.setAttribute('stroke-dashoffset', dashOffset);
    progressCircle.setAttribute('stroke-linecap', 'round');
    progressCircle.setAttribute('transform', `rotate(-90 ${centerX} ${centerY})`);
    svg.appendChild(progressCircle);
}

function renderConversionTable() {
    const table = document.getElementById('conversionTable');
    const ranges = [
        { range: '96+', grade: '1.00' },
        { range: '90–95', grade: '1.25' },
        { range: '84–89', grade: '1.50' },
        { range: '78–83', grade: '1.75' },
        { range: '72–77', grade: '2.00' },
        { range: '66–71', grade: '2.25' },
        { range: '60–65', grade: '2.50' },
        { range: '55–59', grade: '2.75' },
        { range: '50–54', grade: '3.00' },
        { range: '40–49', grade: '4.00' },
        { range: 'Below 40', grade: '5.00' }
    ];

    table.innerHTML = '';
    ranges.forEach((r, index) => {
        const row = document.createElement('div');
        row.className = 'conv-row';
        row.id = `conv-row-${index}`;
        row.innerHTML = `<span>${r.range}%</span><span>${r.grade}</span>`;
        table.appendChild(row);
    });
}

function highlightConversionRow(percentage) {
    document.querySelectorAll('.conv-row').forEach(row => row.classList.remove('active'));

    let rowIndex = -1;
    if (percentage >= 96) rowIndex = 0;
    else if (percentage >= 90) rowIndex = 1;
    else if (percentage >= 84) rowIndex = 2;
    else if (percentage >= 78) rowIndex = 3;
    else if (percentage >= 72) rowIndex = 4;
    else if (percentage >= 66) rowIndex = 5;
    else if (percentage >= 60) rowIndex = 6;
    else if (percentage >= 55) rowIndex = 7;
    else if (percentage >= 50) rowIndex = 8;
    else if (percentage >= 40) rowIndex = 9;
    else if (percentage >= 0) rowIndex = 10;

    if (rowIndex >= 0) {
        document.getElementById(`conv-row-${rowIndex}`).classList.add('active');
    }
}