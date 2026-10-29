const errorHandler = (error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        success: false,
        message: "An internal server error occurred"
    });
};

module.exports = errorHandler;