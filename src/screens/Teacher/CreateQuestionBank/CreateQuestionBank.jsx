import React, { useEffect, useState } from 'react';
import { TextField, Radio, RadioGroup, FormControlLabel, Button, FormControl, FormLabel, Checkbox, FormGroup, Paper, Divider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material';
import GLOBAL_CONSTANTS from '../../../../GlobalConstants';

const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent', 
        },
        '&:hover fieldset': {
            borderColor: 'transparent', 
        },
        '&.Mui-focused fieldset': {
            borderColor: 'transparent',
        },
    },
});

const QuestionBankForm = () => {
    const [questionBank, setQuestionBank] = useState({
        name: '',
        description: '',
        method: 'addUI',
        questions: []
    });

    useEffect(() => {
        console.log("questionBank", questionBank)
    }, [questionBank])

    const handleInputChange = (e) => {
        setQuestionBank({ ...questionBank, [e.target.name]: e.target.value });
    };

    const addQuestion = () => {
        setQuestionBank({
            ...questionBank,
            questions: [...questionBank.questions, { question: '', answerType: 'single', marks: '', correctAnswer: [], options: [], numberOfOptions: 0 }]
        });
    };

    const handleQuestionChange = (index, e) => {
        const updatedQuestions = [...questionBank.questions];
        if (e.target.name === 'answerType' && e.target.value === 'single') {
            updatedQuestions[index].correctAnswer = [];
        }
        updatedQuestions[index][e.target.name] = e.target.value;
        setQuestionBank({ ...questionBank, questions: updatedQuestions });
    };

    const handleOptionsChange = (index, optionIndex, e) => {
        const updatedQuestions = [...questionBank.questions];
        updatedQuestions[index].options[optionIndex] = e.target.value;
        setQuestionBank({ ...questionBank, questions: updatedQuestions });
    };

    const handleOptionCountChange = (index, e) => {
        const updatedQuestions = [...questionBank.questions];
        updatedQuestions[index].numberOfOptions = e.target.value;
        updatedQuestions[index].options = Array(parseInt(e.target.value)).fill('');
        setQuestionBank({ ...questionBank, questions: updatedQuestions });
    };

    const handleCorrectAnswerChange = (index, e) => {
        const updatedQuestions = [...questionBank.questions];
        if (updatedQuestions[index].answerType === 'multi') {
            if (e.target.checked) {
                updatedQuestions[index].correctAnswer.push(e.target.value);
            } else {
                updatedQuestions[index].correctAnswer = updatedQuestions[index].correctAnswer.filter(ans => ans !== e.target.value);
            }
        } else {
            updatedQuestions[index].correctAnswer = [e.target.value];
        }
        setQuestionBank({ ...questionBank, questions: updatedQuestions });
    };

    const deleteQuestion = (index) => {
        const updatedQuestions = questionBank.questions.filter((_, i) => i !== index);
        setQuestionBank({ ...questionBank, questions: updatedQuestions });
    };

    const handleSubmit = async () => {
        const apiUrl =`${GLOBAL_CONSTANTS.backend_url}question_bank/create`; // Change this to your actual API URL
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                 headers : {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${GLOBAL_CONSTANTS?.token}`
                  },
                body: JSON.stringify(questionBank),
            });
            if (!response.ok) {
                throw new Error('Failed to submit question bank');
            }
            const result = await response.json();
            console.log('Question bank submitted successfully:', result);
            alert('Question bank submitted successfully!');
        } catch (error) {
            console.error('Error submitting question bank:', error);
            alert('Error submitting question bank. Please try again.');
        }
    };



    return (
        <div className="min-h-screen pt-5 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Paper elevation={0} className="overflow-hidden mb-6 bg-gradient-to-br from-indigo-50 to-pink-50">
                    <div className="p-3 md:p-5">
                        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">New Question Bank</h1>

                        <div className="flex flex-col items-center justify-center">
                            <div className="w-full max-w-md">
                                <TextField
                                    fullWidth
                                    label="Question Bank Name"
                                    name="name"
                                    variant="outlined"
                                    value={questionBank.name}
                                    onChange={handleInputChange}
                                    className="mb-4"
                                    InputLabelProps={{ className: "font-medium" }}
                                />
                                <div className='py-4'>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        variant="outlined"
                                        value={questionBank.description}
                                        onChange={handleInputChange}
                                        className="mb-4"
                                        InputLabelProps={{ className: "font-medium" }}
                                    />
                                </div>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Add Questions Method</FormLabel>
                                    <RadioGroup
                                        row
                                        name="method"
                                        value={questionBank.method}
                                        onChange={handleInputChange}
                                        className="justify-center"
                                    >
                                        <FormControlLabel value="uploadFile" control={<Radio color="primary" />} label="Upload File" />
                                        <FormControlLabel value="addUI" control={<Radio color="primary" />} label="Add from UI" />
                                        <FormControlLabel value="generateAI" control={<Radio color="primary" />} label="Generate from AI" />
                                    </RadioGroup>
                                </FormControl>


                            </div>
                        </div>
                    </div>
                </Paper>





                {questionBank.method === 'addUI' && questionBank.questions.map((question, index) => (
                    <Paper key={index} className="overflow-hidden rounded-lg shadow mb-6 bg-gradient-to-br from-indigo-50 to-pink-50">
                        <div className="p-6">
                            <div className='flex justify-between pb-5'>
                                <h2 className="text-xl font-semibold text-indigo-700 mb-4">Question {index + 1}</h2>
                                <Button
                                    startIcon={<DeleteIcon />}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => deleteQuestion(index)}
                                    className="mt-4"
                                >
                                    Delete Question
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <TextField
                                    label="Question"
                                    name="question"
                                    variant="outlined"
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(index, e)}
                                    className="shadow-sm rounded"
                                />
                                <TextField
                                    label="Marks"
                                    name="marks"
                                    variant="outlined"
                                    type="number"
                                    value={question.marks}
                                    onChange={(e) => handleQuestionChange(index, e)}
                                    className="shadow-sm rounded"
                                />
                                <TextField
                                    label="Number of Options"
                                    name="numberOfOptions"
                                    variant="outlined"
                                    type="number"
                                    value={question.numberOfOptions}
                                    onChange={(e) => handleOptionCountChange(index, e)}
                                    className="shadow-sm rounded"
                                />

                                {question.options.map((option, optionIndex) => (
                                    <TextField
                                        key={optionIndex}
                                        label={`Option ${optionIndex + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionsChange(index, optionIndex, e)}
                                        className="shadow-sm rounded"
                                    />
                                ))}
                            </div>

                            <div className='flex'>
                                <FormControl component="fieldset" className="mb-4">
                                    <FormLabel component="legend" className="text-lg font-medium text-gray-700">Answer Type</FormLabel>
                                    <RadioGroup
                                        row
                                        name="answerType"
                                        value={question.answerType}
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        className="mt-2"
                                    >
                                        <FormControlLabel value="single" control={<Radio color="primary" />} label="Single Select" />
                                        <FormControlLabel value="multi" control={<Radio color="primary" />} label="Multi Select" />
                                    </RadioGroup>
                                </FormControl>
                                <div className='pl-10'>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend" >Correct Answer</FormLabel>
                                        {question.answerType === 'multi' ? (
                                            <FormGroup className="mt-2">
                                                {question.options.map((option, optionIndex) => (
                                                    <FormControlLabel
                                                        key={optionIndex}
                                                        control={
                                                            <Checkbox
                                                                checked={question.correctAnswer.includes(option)}
                                                                onChange={(e) => handleCorrectAnswerChange(index, e)}
                                                                value={option}
                                                                color="primary"
                                                            />
                                                        }
                                                        label={`Option ${optionIndex + 1}`}
                                                    />
                                                ))}
                                            </FormGroup>
                                        ) : (
                                            <div className='pt-3'>
                                                <TextField
                                                    select
                                                    // label="Correct Answer"
                                                    SelectProps={{ native: true }}
                                                    name="correctAnswer"
                                                    value={question.correctAnswer[0] || ''}
                                                    onChange={(e) => handleCorrectAnswerChange(index, e)}
                                                    className="w-full mt-12 shadow-sm rounded pt-10"
                                                    inputProps={{
                                                        style: { paddingTop: '5px', paddingBottom: '5px', },
                                                        className: "text-sm"
                                                    }}
                                                >
                                                    {question.options.map((option, optionIndex) => (
                                                        <option key={optionIndex} value={option}>{`Option ${optionIndex + 1}`}</option>
                                                    ))}
                                                </TextField>
                                            </div>

                                        )}
                                    </FormControl>
                                </div></div>

                        </div>
                        <Divider />
                    </Paper>
                ))}


                {questionBank?.method === 'addUI' && (
                    <Button
                        startIcon={<AddCircleOutlineIcon />}
                        variant="contained"
                        color="primary"
                        onClick={addQuestion}
                        className="mt-4"
                    >
                        Add Question
                    </Button>
                )}
                 {questionBank?.questions?.length > 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        className="mt-4"
                    >
                        Submit Question Bank
                    </Button>
                )}
            </div>
        </div>
    );
};

export default QuestionBankForm;

