
declare const html2pdf: any;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resumeForm') as HTMLFormElement;
    const resumeContainer = document.getElementById('resume') as HTMLElement;
    const editToggle = document.getElementById('editToggle') as HTMLButtonElement;
    const shareButton = document.getElementById('shareButton') as HTMLButtonElement;
    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
    const shareUrl = document.getElementById('shareUrl') as HTMLElement;
    const shareLink = document.getElementById('shareLink') as HTMLInputElement;
    const copyLink = document.getElementById('copyLink') as HTMLButtonElement;
    const resumeActions = document.getElementById('resumeActions') as HTMLElement;
    let isEditing = false;

    form.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        updateResume();
        generateUniqueUrl();
    });

    editToggle.addEventListener('click', () => {
        isEditing = !isEditing;
        editToggle.textContent = isEditing ? 'Save Changes' : 'Edit Resume';
        toggleEditMode();
    });

    shareButton.addEventListener('click', () => {
        shareUrl.style.display = 'block';
    });

    downloadButton.addEventListener('click', () => {
        const element = document.getElementById('resume');
        if (element) {
            html2pdf().from(element).save('resume.pdf');
        }
    });

    copyLink.addEventListener('click', () => {
        shareLink.select();
        document.execCommand('copy');
        alert('Link copied to clipboard!');
    });

    function updateResume() {
        const fields = ['name', 'title', 'email', 'phone', 'degree', 'school', 'eduYear', 'jobTitle', 'company', 'expYear', 'responsibilities', 'skills'];
        
        fields.forEach(field => {
            const input = document.getElementById(field) as HTMLInputElement | HTMLTextAreaElement;
            const output = document.getElementById(`resume${field.charAt(0).toUpperCase() + field.slice(1)}`) as HTMLElement;
            
            if (field === 'responsibilities' || field === 'skills') {
                output.innerHTML = '';
                input.value.split(',').forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.trim();
                    output.appendChild(li);
                });
            } else {
                output.textContent = field === 'email' || field === 'phone' ? `${field.charAt(0).toUpperCase() + field.slice(1)}: ${input.value}` : input.value;
            }
        });

        resumeContainer.style.display = 'block';
        resumeActions.style.display = 'block';
    }

    function toggleEditMode() {
        const editableElements = document.querySelectorAll('.editable');
        
        editableElements.forEach((element: Element) => {
            if (isEditing) {
                element.addEventListener('click', editField);
                element.classList.add('editing');
            } else {
                element.removeEventListener('click', editField);
                element.classList.remove('editing');
            }
        });
    }

    function editField(e: Event) {
        const element = e.currentTarget as HTMLElement;
        const field = element.dataset.field;
        const currentText = element.innerText;
        
        if (field === 'responsibilities' || field === 'skills') {
            const textarea = document.createElement('textarea');
            textarea.value = Array.from(element.children).map(li => li.textContent).join(', ');
            element.innerHTML = '';
            element.appendChild(textarea);
            textarea.focus();
            
            textarea.addEventListener('blur', () => {
                element.innerHTML = '';
                textarea.value.split(',').forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.trim();
                    element.appendChild(li);
                });
            });
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            element.innerHTML = '';
            element.appendChild(input);
            input.focus();
            
            input.addEventListener('blur', () => {
                element.textContent = input.value;
            });
        }
    }

    function generateUniqueUrl() {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const baseUrl = window.location.origin;
        const uniqueUrl = `${baseUrl}/${username}/resume`;
        shareLink.value = uniqueUrl;
    }
});