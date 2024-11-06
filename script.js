document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('resumeForm');
    var resumeContainer = document.getElementById('resume');
    var editToggle = document.getElementById('editToggle');
    var shareButton = document.getElementById('shareButton');
    var downloadButton = document.getElementById('downloadButton');
    var shareUrl = document.getElementById('shareUrl');
    var shareLink = document.getElementById('shareLink');
    var copyLink = document.getElementById('copyLink');
    var resumeActions = document.getElementById('resumeActions');
    var isEditing = false;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        updateResume();
        generateUniqueUrl();
    });
    editToggle.addEventListener('click', function () {
        isEditing = !isEditing;
        editToggle.textContent = isEditing ? 'Save Changes' : 'Edit Resume';
        toggleEditMode();
    });
    shareButton.addEventListener('click', function () {
        shareUrl.style.display = 'block';
    });
    downloadButton.addEventListener('click', function () {
        var element = document.getElementById('resume');
        if (element) {
            html2pdf().from(element).save('resume.pdf');
        }
    });
    copyLink.addEventListener('click', function () {
        shareLink.select();
        document.execCommand('copy');
        alert('Link copied to clipboard!');
    });
    function updateResume() {
        var fields = ['name', 'title', 'email', 'phone', 'degree', 'school', 'eduYear', 'jobTitle', 'company', 'expYear', 'responsibilities', 'skills'];
        fields.forEach(function (field) {
            var input = document.getElementById(field);
            var output = document.getElementById("resume".concat(field.charAt(0).toUpperCase() + field.slice(1)));
            if (field === 'responsibilities' || field === 'skills') {
                output.innerHTML = '';
                input.value.split(',').forEach(function (item) {
                    var li = document.createElement('li');
                    li.textContent = item.trim();
                    output.appendChild(li);
                });
            }
            else {
                output.textContent = field === 'email' || field === 'phone' ? "".concat(field.charAt(0).toUpperCase() + field.slice(1), ": ").concat(input.value) : input.value;
            }
        });
        resumeContainer.style.display = 'block';
        resumeActions.style.display = 'block';
    }
    function toggleEditMode() {
        var editableElements = document.querySelectorAll('.editable');
        editableElements.forEach(function (element) {
            if (isEditing) {
                element.addEventListener('click', editField);
                element.classList.add('editing');
            }
            else {
                element.removeEventListener('click', editField);
                element.classList.remove('editing');
            }
        });
    }
    function editField(e) {
        var element = e.currentTarget;
        var field = element.dataset.field;
        var currentText = element.innerText;
        if (field === 'responsibilities' || field === 'skills') {
            var textarea_1 = document.createElement('textarea');
            textarea_1.value = Array.from(element.children).map(function (li) { return li.textContent; }).join(', ');
            element.innerHTML = '';
            element.appendChild(textarea_1);
            textarea_1.focus();
            textarea_1.addEventListener('blur', function () {
                element.innerHTML = '';
                textarea_1.value.split(',').forEach(function (item) {
                    var li = document.createElement('li');
                    li.textContent = item.trim();
                    element.appendChild(li);
                });
            });
        }
        else {
            var input_1 = document.createElement('input');
            input_1.type = 'text';
            input_1.value = currentText;
            element.innerHTML = '';
            element.appendChild(input_1);
            input_1.focus();
            input_1.addEventListener('blur', function () {
                element.textContent = input_1.value;
            });
        }
    }
    function generateUniqueUrl() {
        var username = document.getElementById('username').value;
        var baseUrl = window.location.origin;
        var uniqueUrl = "".concat(baseUrl, "/").concat(username, "/resume");
        shareLink.value = uniqueUrl;
    }
});
