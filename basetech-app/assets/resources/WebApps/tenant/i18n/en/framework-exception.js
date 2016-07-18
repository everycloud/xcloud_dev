define([], function () {
    var exceptionMap = {
        "0000010006": {
            "cause":"The request entity contains invalid charactors.",
            "desc":"The server understands the content type of the request entity (syntactically correct) but was unable to process the contained instructions.",
            "solution":"Correct your input charactors."
        },
		"0000010013": {
            "cause":"Invalid picture. Use a .ico picture with a maximum size of 128 KB.",
            "desc":"Invalid picture. Use a .ico picture with a maximum size of 128 KB.",
            "solution":"Invalid picture. Use a .ico picture with a maximum size of 128 KB."
        },
		"0000010014": {
            "cause":"Invalid picture. Use a .png 48p x 48p picture with a maximum size of 128 KB.",
            "desc":"Invalid picture. Use a .png 48p x 48p picture with a maximum size of 128 KB.",
            "solution":"Invalid picture. Use a .png 48p x 48p picture with a maximum size of 128 KB."
        }
	};
    return exceptionMap;
})
