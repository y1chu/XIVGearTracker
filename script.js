const MEMBER_COUNT = 8;
const GEAR_TYPES = [
    'Weapon',
    'Head',
    'Body',
    'Hands',
    'Legs',
    'Feet',
    'Earrings',
    'Necklace',
    'Bracelets',
    'Left Ring',
    'Right Ring'
];

// Default member names
const MEMBER_NAMES = [
    'TANK 1', 'TANK 2', 'HEALER 1', 'HEALER 2', 'DPS 1', 'DPS 2', 'DPS 3', 'DPS 4'
];

const gearOptions = [
    'Raid Gear',
    'Tome Gear',
    'Crafter Gear'
];

function generatePassword(event) {
    event.preventDefault();

    const password = Math.random().toString(36).substr(2, 10);
    saveData(password);

    const recoveryPasswordInput = document.getElementById('recoveryPassword');
    recoveryPasswordInput.value = password;
    recoveryPasswordInput.select();
    document.execCommand('copy');

    alert('Data saved successfully! Recovery password copied to clipboard.');
}

function saveData(password) {
    const formData = {};
    const container = document.getElementById('membersContainer');

    for (let i = 0; i < container.children.length; i++) {
        const memberDiv = container.children[i];
        const memberData = {};

        const memberNameInput = memberDiv.querySelector('input[name="memberName' + (i + 1) + '"]');
        const memberName = memberNameInput.value || memberNameInput.placeholder;
        memberData['name'] = memberName;

        for (let j = 1; j <= GEAR_TYPES.length; j++) {
            const gearSelect = memberDiv.querySelector('select[name="gear' + (i + 1) + '-' + j + '"]');
            const obtainedCheckbox = memberDiv.querySelector('input[name="obtained' + (i + 1) + '-' + j + '"]');
            const dateObtainedInput = memberDiv.querySelector('input[name="dateObtained' + (i + 1) + '-' + j + '"]');

            memberData['gear' + j] = gearSelect.value;
            memberData['obtained' + j] = obtainedCheckbox.checked;
            memberData['dateObtained' + j] = dateObtainedInput.value;
        }

        formData['member' + (i + 1)] = memberData;
    }

    localStorage.setItem(password, JSON.stringify(formData));
}

function loadData() {
    const passwordInput = document.getElementById('recoveryPassword');
    const password = passwordInput.value;

    if (password && localStorage.getItem(password)) {
        const formData = JSON.parse(localStorage.getItem(password));
        const container = document.getElementById('membersContainer');

        for (let i = 0; i < container.children.length; i++) {
            const memberDiv = container.children[i];
            const memberData = formData['member' + (i + 1)];

            const memberNameInput = memberDiv.querySelector('input[name="memberName' + (i + 1) + '"]');
            memberNameInput.value = memberData['name'];

            for (let j = 1; j <= GEAR_TYPES.length; j++) {
                const gearSelect = memberDiv.querySelector('select[name="gear' + (i + 1) + '-' + j + '"]');
                const obtainedCheckbox = memberDiv.querySelector('input[name="obtained' + (i + 1) + '-' + j + '"]');
                const dateObtainedInput = memberDiv.querySelector('input[name="dateObtained' + (i + 1) + '-' + j + '"]');

                gearSelect.value = memberData['gear' + j];
                obtainedCheckbox.checked = memberData['obtained' + j];
                dateObtainedInput.value = memberData['dateObtained' + j];
            }
        }

        passwordInput.value = '';
        alert('Data recovered successfully!');
    } else {
        alert('Invalid recovery password!');
    }
}

function addMember() {
    const container = document.getElementById('membersContainer');
    const memberCount = container.childElementCount + 1;
    const memberName = MEMBER_NAMES[memberCount - 1];

    const memberDiv = document.createElement('div');
    memberDiv.className = 'member';

    if (memberCount <= 2) {
        memberDiv.classList.add('tank');
    } else if (memberCount <= 4) {
        memberDiv.classList.add('healer');
    } else {
        memberDiv.classList.add('dps');
    }

    memberDiv.innerHTML = '<h3><input type="text" name="memberName' + memberCount + '" placeholder="' + memberName + '"></h3>';

    for (let i = 1; i <= GEAR_TYPES.length; i++) {
        const gearDiv = document.createElement('div');
        gearDiv.className = 'gear';

        const selectOptions = getGearOptions();
        gearDiv.innerHTML = '<label>' + GEAR_TYPES[i - 1] + ':</label><select name="gear' + memberCount + '-' + i + '">' + selectOptions + '</select><div class="obtained-date"><div><label>Obtained:</label><input type="checkbox" name="obtained' + memberCount + '-' + i + '"></div><div><label>Date Obtained:</label><input type="date" name="dateObtained' + memberCount + '-' + i + '"></div></div>';

        memberDiv.appendChild(gearDiv);
    }

    container.appendChild(memberDiv);
}

function getGearOptions() {
    let options = '';
    for (let i = 0; i < gearOptions.length; i++) {
        options += '<option value="' + gearOptions[i] + '">' + gearOptions[i] + '</option>';
    }
    return options;
}

function initializeForm() {
    for (let i = 0; i < MEMBER_COUNT; i++) {
        addMember();
    }
}

window.addEventListener('DOMContentLoaded', initializeForm);

document.querySelector('.button').addEventListener('click', generatePassword);

document.getElementById('recoveryPassword').addEventListener('focus', function() {
    this.select();
});

