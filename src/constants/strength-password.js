const hasNumber = value => {
    return new RegExp(/[0-9]/).test(value);
}

const hasMixed = value => {
    return new RegExp(/[a-z]/).test(value) &&
        new RegExp(/[A-Z]/).test(value);
}

const hasSpecial = value => {
    return new RegExp(/[!#@$%^&*)(+=._-]/).test(value);
}

export const strengthColor = count => {

    if (count == 0)
        return '#ced4da';

    if (count < 2)
        return 'red';

    if (count < 3)
        return 'orange';

    if (count < 4)
        return 'lightgreen';

    if (count < 5)
        return 'green';
}

export const strengthVisibility = count => {

    if (count == 0)
        return true;

    else
        return false;
}

export const strengthWidth = count => {

    if (count == 0)
        return 1;

    else
        return 2;
}

export const strengthName = count => {

    if (count == 0)
        return '';

    if (count < 2)
        return 'very weak';

    if (count < 3)
        return 'weak';

    if (count < 4)
        return 'good';

    if (count < 5)
        return 'strong';
}

export const strengthIndicator = value => {
    let strengths = 0;

    if (value.length > 0)
        strengths++;

    if (value.length > 4)
        strengths++;

    if (hasNumber(value))
        strengths++;

    if (hasSpecial(value))
        strengths++;

    if (hasMixed(value))
        strengths++;

    return strengths;
}