document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.innerText = 'Copy';
        button.classList.add('copy-button');

        button.addEventListener('click', () => {
            const code = block.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.innerText = 'Copied!';
                setTimeout(() => {
                    button.innerText = 'Copy';
                }, 2000);
            });
        });

        const wrapper = document.createElement('div');
        wrapper.classList.add('code-block');
        block.parentNode.replaceChild(wrapper, block);
        wrapper.appendChild(block);
        wrapper.appendChild(button);
    });
});
