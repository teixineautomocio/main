function isSizeValid(size, mb_size) {
    return (size <= (mb_size * Math.pow(1024, 2))) || alert(Translator.trans('Js.The_maximum_file_size_could_not_exceed', { 'max_size': mb_size }));
}