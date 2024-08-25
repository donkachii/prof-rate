
const Button = ({ onClick, value, className, type }) => {
	return (
		<>
			<button onClick={onClick} value={value} className={className} type={type}>
				{value}
			</button>
		</>
	);
};


export default Button;
