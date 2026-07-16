import pathlib

from cli import HermesCLI


def _build_cli_instance() -> HermesCLI:
    return object.__new__(HermesCLI)


def test_no_image_and_no_text_returns_empty():
    cli = _build_cli_instance()
    assert cli._preprocess_images_with_vision("", []) == ""


def test_image_only_input_uses_neutral_marker(tmp_path: pathlib.Path):
    cli = _build_cli_instance()
    assert cli._preprocess_images_with_vision("", [tmp_path / "x.png"], announce=False) == "[image attached]"


def test_user_text_without_images_is_preserved():
    cli = _build_cli_instance()
    assert cli._preprocess_images_with_vision("Hello", [], announce=False) == "Hello"


def test_explicit_description_question_is_preserved(tmp_path: pathlib.Path):
    cli = _build_cli_instance()
    assert cli._preprocess_images_with_vision(
        "What do you see in this image?",
        [tmp_path / "x.png"],
        announce=False,
    ) == "What do you see in this image?"
