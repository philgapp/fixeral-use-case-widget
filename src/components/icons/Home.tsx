const Home = ({ ...props }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="black"
            width="18px"
            height="18px"
            {...props}
        >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
    );
};

export default Home;
