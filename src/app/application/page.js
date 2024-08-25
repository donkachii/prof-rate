'use client';
import Image from 'next/image';
import styles from '../page.module.css'
import { useState } from 'react';
import { Assistant } from 'next/font/google';

const page = () => {
	const [messages, setMessages] = useState([
		{
			role: 'assistant',
			content: "Hi! I'm Rate My Professor assistant, How can I help you today?",
		},
	]);
	const [message, setMessage] = useState('');

	const sendMessage = async () => {
		if (message.trim() === '') return;

		setMessages((prevMessages) => [
			...prevMessages,
			{ role: 'user', content: message },
			{ role: 'assistant', content: '' },
		]);

		setMessage('');

		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify([...messages, { role: 'user', content: message }]),
		});

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let result = '';

		reader.read().then(function processText({ done, value }) {
			if (done) return result;

			const text = decoder.decode(value || new Uint8Array(), {
				stream: true,
			});
			result += text;

			setMessages((prevMessages) => {
				let lastMessage = prevMessages[prevMessages.length - 1];
				let otherMessages = prevMessages.slice(0, prevMessages.length - 1);
				return [
					...otherMessages,
					{ ...lastMessage, content: lastMessage.content + text },
				];
			});

			return reader.read().then(processText);
		});
	};
	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<div
				style={{
					width: '500px',
					height: '700px',
					border: '1px solid black',
					padding: '16px',
					display: 'flex',
					flexDirection: 'column',
					gap: '24px',
				}}>
				<div
					style={{
						flexGrow: 1,
						overflowY: 'auto',
						maxHeight: '100%',
						display: 'flex',
						flexDirection: 'column',
						gap: '16px',
					}}>
					{messages.map((message, index) => (
						<div
							key={index}
							style={{
								display: 'flex',
								justifyContent:
									message.role === 'assistant' ? 'flex-start' : 'flex-end',
							}}>
							<div
								style={{
									backgroundColor:
										message.role === 'assistant' ? '#3f51b5' : '#f50057',
									color: 'white',
									borderRadius: '16px',
									padding: '12px',
									maxWidth: '80%',
								}}>
								{message.content}
							</div>
						</div>
					))}
				</div>
				<div style={{ display: 'flex', gap: '16px' }}>
					<input
						type='text'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder='Type your message...'
						style={{
							flex: 1,
							padding: '12px',
							borderRadius: '8px',
							border: '1px solid #ccc',
						}}
					/>
					<button
						onClick={sendMessage}
						style={{
							padding: '12px 24px',
							borderRadius: '8px',
							backgroundColor: '#007BFF',
							color: 'white',
							border: 'none',
							cursor: 'pointer',
						}}>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

export default page;
