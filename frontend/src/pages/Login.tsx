import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import TwitterLogo from '../styles/assets/twitter-logo.png';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

interface LoginValues {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  // we can also get [login, { data }], then we don't need to assign the response of login to a variable
  const [login] = useMutation(LOGIN_MUTATION);

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Password required'),
  });

  return (
    <div>
      <img
        src={TwitterLogo}
        alt='logo'
        style={{ width: '50px' }}
        className='logo'
      />
      <h3>Log in to Fake Twitter</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await login({ variables: values });
          console.log(response);
          localStorage.setItem('token', response.data.login.token);
          setSubmitting(false);
          navigate('/users');
        }}
      >
        <Form>
          <Field name='email' type='text' placeholder='Email' />
          <ErrorMessage name='email' component='div' />
          <Field name='password' type='password' placeholder='Password' />
          <ErrorMessage name='password' component='div' />
          <button type='submit' className='login-button'>
            <span>Login</span>
          </button>
        </Form>
      </Formik>
      <div className='register'>
        <h4>Don't have an account?</h4>
        <Link to='/signup'>Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
