from tui_gateway.server import _enrich_with_attached_images


def test_enrich_without_prompt_and_missing_image_uses_image_marker():
    assert _enrich_with_attached_images("", ["/this/path/does/not/exist.png"]) == "[image attached]"


def test_enrich_without_prompt_and_without_images_is_empty():
    assert _enrich_with_attached_images("", []) == ""


def test_enrich_with_prompt_and_missing_images_preserves_prompt():
    assert (
        _enrich_with_attached_images(
            "What should I do with this photo?",
            ["/does/not/exist/image.png"],
        )
        == "What should I do with this photo?"
    )
