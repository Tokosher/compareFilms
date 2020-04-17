const createAutocomplete = ({root, renderOption, optionSelect, inputValue, getData}) => {

    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input">
        <div class="dropdown">
            <div class="dropdown-menu"> 
                <div class="dropdown-content results"></div>
            </div>
        </div>
`;

    const input = root.querySelector('input');
    const results = root.querySelector('.results');
    const dropDown = root.querySelector('.dropdown');

    const debound = callback => {

        let timeout;

        return (...args) => {

            if(timeout) clearTimeout(timeout);

            timeout = setTimeout(() => {
                callback.apply(null, args);
            }, 1000)

        }

    };

    const onInput = async e => {
        let target = await getData(e.target.value);

        if(!target.length) {
            dropDown.classList.remove('is-active');
            return;
        }

        results.innerHTML = '';
        dropDown.classList.add('is-active');

        for(let key of target) {

            const anchor = document.createElement('a');


            anchor.classList.add('dropdown-item');
            anchor.innerHTML = renderOption(key);

            anchor.addEventListener('click', () => {
                dropDown.classList.remove('is-active');
                input.value = inputValue(key);

                optionSelect(key);
                onMovik(key);
            });
            results.appendChild(anchor);

        }

    };

    input.addEventListener('input', debound(onInput));

    root.addEventListener('click', (e) => {
        if(!root.contains(e.target)) {
            dropDown.classList.remove('is-active');
        }
    });
};