import React from "react";
import styles from "@/styles/TodoList.module.css";

const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
        <li className={ styles.todoItem }>
            <input type="checkbox" checked={ todo.completed } onChange={ onToggle }/>
            <span 
                className={ styles.todoText }
                style={{ textDecoration : todo.completed ? "line-through" : "none"}}
            >{ todo.text }</span>
            <span
                className={ styles.todoText }
                style={{ textDecoration : todo.completed ? "line-through" : "none"}}
            >{ todo.date.toDate().toLocaleDateString("ko-KR", 
            {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit' 
            })}
            </span>
            <button onClick={ onDelete }>Delete</button>
        </li>
    );
};

export default TodoItem;